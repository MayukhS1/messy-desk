"use client";

import Link from "next/link";
import { useRef, useCallback, useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import type { DeskItem } from "@/types/database";
import { huntItemRegistry } from "@/lib/items/registry";
import { cn } from "@/lib/utils";
import {
  clampDeskPosition,
  createRestrictToRect,
} from "@/components/desk/dndModifiers";
import { DeskSurface } from "./DeskSurface";
import { DraggableDeskItem, StaticDeskItem } from "./DraggableDeskItem";
import { Button } from "@/components/ui/Button";
import { HuntExploreProvider } from "@/components/hunt/HuntExploreContext";

const ITEM_SIZE = 72;

export function DeskCanvas({
  items,
  mode,
  selectedId,
  onSelectItem,
  onUnlockItem,
  onItemMove,
  unlockedIds,
  className,
  showGrid,
  surfaceLabel,
  layoutDraggable,
}: {
  items: DeskItem[];
  mode: "edit" | "explore" | "view";
  selectedId?: string | null;
  onSelectItem?: (id: string) => void;
  onUnlockItem?: (id: string) => void;
  onItemMove?: (id: string, x: number, y: number) => void;
  unlockedIds?: Set<string>;
  className?: string;
  showGrid?: boolean;
  surfaceLabel?: string;
  /** Allow drag during explore to rearrange view (local only). */
  layoutDraggable?: boolean;
}) {
  const areaRef = useRef<HTMLDivElement>(null);
  const dragOriginRef = useRef<{ id: string; x: number; y: number } | null>(
    null
  );
  const [dragPosition, setDragPosition] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);
  const isView = mode === "view";
  const canDrag =
    (mode === "edit" && !!onItemMove) ||
    (mode === "explore" && layoutDraggable && !!onItemMove);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.z_index - b.z_index),
    [items]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  const getAreaSize = useCallback(() => {
    const el = areaRef.current;
    if (!el) return { width: 0, height: 0 };
    return { width: el.clientWidth, height: el.clientHeight };
  }, []);

  const clamp = useCallback(
    (x: number, y: number, scale = 1) => {
      const { width, height } = getAreaSize();
      return clampDeskPosition(x, y, width, height, ITEM_SIZE, scale);
    },
    [getAreaSize]
  );

  const modifiers = useMemo(
    () => [
      createRestrictToRect(
        () => areaRef.current?.getBoundingClientRect() ?? null
      ),
    ],
    []
  );

  const getItemPosition = useCallback(
    (item: DeskItem) => {
      if (dragPosition?.id === item.id) {
        return { x: dragPosition.x, y: dragPosition.y };
      }
      return clamp(item.pos_x, item.pos_y, item.scale ?? 1);
    },
    [clamp, dragPosition]
  );

  const handleDragStart = (event: DragStartEvent) => {
    const item = items.find((i) => i.id === event.active.id);
    if (!item) return;
    const pos = clamp(item.pos_x, item.pos_y, item.scale ?? 1);
    dragOriginRef.current = { id: item.id, x: pos.x, y: pos.y };
    setDragPosition({ id: item.id, x: pos.x, y: pos.y });
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const origin = dragOriginRef.current;
    if (!origin || origin.id !== event.active.id) return;

    const item = items.find((i) => i.id === event.active.id);
    if (!item) return;

    const next = clamp(
      origin.x + event.delta.x,
      origin.y + event.delta.y,
      item.scale ?? 1
    );
    setDragPosition({ id: item.id, x: next.x, y: next.y });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const origin = dragOriginRef.current;
    dragOriginRef.current = null;
    setDragPosition(null);

    const item = items.find((i) => i.id === event.active.id);
    if (!item || !onItemMove || !origin) return;

    const next = clamp(
      origin.x + event.delta.x,
      origin.y + event.delta.y,
      item.scale ?? 1
    );
    onItemMove(item.id, next.x, next.y);
  };

  const handleDragCancel = () => {
    dragOriginRef.current = null;
    setDragPosition(null);
  };

  const renderItem = (item: DeskItem) => {
    const Component = huntItemRegistry[item.item_type];
    if (!Component) return null;

    const pos = getItemPosition(item);
    const isDragging = dragPosition?.id === item.id;

    const props = {
      item,
      mode,
      isSelected: selectedId === item.id,
      isUnlocked: unlockedIds?.has(item.id) ?? false,
      onSelect: () => onSelectItem?.(item.id),
      onUnlock: () => onUnlockItem?.(item.id),
    };

    const inner = <Component {...props} />;

    if (canDrag) {
      return (
        <DraggableDeskItem
          key={item.id}
          id={item.id}
          x={pos.x}
          y={pos.y}
          rotation={item.rotation}
          scale={item.scale}
          zIndex={isDragging ? 1000 : item.z_index}
        >
          {inner}
        </DraggableDeskItem>
      );
    }

    return (
      <StaticDeskItem
        key={item.id}
        x={pos.x}
        y={pos.y}
        rotation={item.rotation}
        scale={item.scale}
        zIndex={item.z_index}
      >
        {inner}
      </StaticDeskItem>
    );
  };

  const content = (
    <div
      ref={areaRef}
      className="relative h-full w-full min-h-0 overflow-hidden isolate"
    >
      {sortedItems.map(renderItem)}

      {items.length === 0 && mode === "edit" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-amber-950/40 text-sm gap-2 pointer-events-none px-4 text-center">
          <span className="text-3xl opacity-50">🖊️</span>
          <p>Add items from the palette, then drag them around</p>
        </div>
      )}

      {items.length === 0 && isView && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-amber-950/40 text-sm gap-2 pointer-events-none px-4 text-center">
          <p>Your desk is empty — add items in the editor</p>
        </div>
      )}
    </div>
  );

  return (
    <div className={cn("relative h-full w-full", className)}>
      <DeskSurface
        showGrid={showGrid && !isView}
        readonly={isView}
        label={surfaceLabel}
      >
        {canDrag ? (
          <DndContext
            sensors={sensors}
            modifiers={modifiers}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            {mode === "explore" ? (
              <HuntExploreProvider>{content}</HuntExploreProvider>
            ) : (
              content
            )}
          </DndContext>
        ) : mode === "explore" ? (
          <HuntExploreProvider>{content}</HuntExploreProvider>
        ) : (
          content
        )}
      </DeskSurface>

      {isView && (
        <div className="absolute inset-x-[3%] top-[5%] bottom-[10%] z-20 flex items-end justify-center pb-6 pointer-events-none">
          <div className="pointer-events-auto mx-4 border-2 border-amber-800/30 bg-yellow-50/95 px-4 py-3 shadow-lg filter-hand-drawn rotate-[-1deg]">
            <Link href="/desk/edit" className="block">
              <Button size="sm" className="w-full min-w-[140px]">
                Open editor
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
