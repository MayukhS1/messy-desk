"use client";

import Link from "next/link";
import { useRef, useCallback, useMemo, useState, useEffect } from "react";
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
import {
  getItemRenderedDimensions,
  logicalToRendered,
  renderedToLogical,
  toLogicalCoordinates,
} from "@/lib/desk/coordinates";
import { DeskSurface } from "./DeskSurface";
import { DraggableDeskItem, StaticDeskItem } from "./DraggableDeskItem";
import { Button } from "@/components/ui/Button";
import { HuntExploreProvider } from "@/components/hunt/HuntExploreContext";
import { ScrapbookRulesCard } from "@/components/editor/ScrapbookRulesCard";
import { HUNT_TARGET_COUNT } from "@/lib/constants";

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
  surfaceVariant,
  hideViewOverlay,
  hideSurfaceLabel,
  huntTargetIds,
  showRulesCard,
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
  surfaceVariant?: "default" | "topdown";
  /** Hide the legacy center "Open editor" overlay in view mode */
  hideViewOverlay?: boolean;
  /** Hide the surface title label (room preview) */
  hideSurfaceLabel?: boolean;
  /** Item ids marked as hunt targets (edit mode badges) */
  huntTargetIds?: string[];
  /** Show collapsible scrapbook rules on canvas */
  showRulesCard?: boolean;
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
  const [areaSize, setAreaSize] = useState({ width: 0, height: 0 });
  const [areaRect, setAreaRect] = useState<DOMRect | null>(null);
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const targetSet = useMemo(
    () => new Set(huntTargetIds ?? []),
    [huntTargetIds]
  );
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

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;

    const update = () => {
      setAreaSize({ width: el.clientWidth, height: el.clientHeight });
      setAreaRect(el.getBoundingClientRect());
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const getRenderedDimensions = useCallback(
    (item: DeskItem) => {
      if (areaSize.width <= 0) {
        return { width: 48, height: 48 };
      }
      return getItemRenderedDimensions(
        item.item_type,
        areaSize.width,
        item.scale ?? 1
      );
    },
    [areaSize.width]
  );

  const clampForItem = useCallback(
    (item: DeskItem, x: number, y: number) => {
      const { width, height } = areaSize;
      if (width <= 0 || height <= 0) {
        return { x, y };
      }
      const dims = getRenderedDimensions(item);
      return clampDeskPosition(x, y, width, height, dims.width, dims.height);
    },
    [areaSize, getRenderedDimensions]
  );

  const toRenderedPosition = useCallback(
    (item: DeskItem) => {
      const { width } = areaSize;
      if (width <= 0) {
        return { x: item.pos_x, y: item.pos_y };
      }
      const logical = toLogicalCoordinates(item.pos_x, item.pos_y);
      return logicalToRendered(logical.x, logical.y, width);
    },
    [areaSize]
  );

  const modifiers = useMemo(
    () => [createRestrictToRect(() => areaRect)],
    [areaRect]
  );

  const getItemPosition = useCallback(
    (item: DeskItem) => {
      if (dragPosition?.id === item.id) {
        return clampForItem(item, dragPosition.x, dragPosition.y);
      }
      const rendered = toRenderedPosition(item);
      return clampForItem(item, rendered.x, rendered.y);
    },
    [clampForItem, dragPosition, toRenderedPosition]
  );

  const handleDragStart = (event: DragStartEvent) => {
    const item = items.find((i) => i.id === event.active.id);
    if (!item) return;
    const pos = getItemPosition(item);
    dragOriginRef.current = { id: item.id, x: pos.x, y: pos.y };
    setDragPosition({ id: item.id, x: pos.x, y: pos.y });
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const origin = dragOriginRef.current;
    if (!origin || origin.id !== event.active.id) return;

    const item = items.find((i) => i.id === event.active.id);
    if (!item) return;

    const next = clampForItem(
      item,
      origin.x + event.delta.x,
      origin.y + event.delta.y
    );
    setDragPosition({ id: item.id, x: next.x, y: next.y });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const origin = dragOriginRef.current;
    dragOriginRef.current = null;
    setDragPosition(null);

    const item = items.find((i) => i.id === event.active.id);
    if (!item || !onItemMove || !origin) return;

    const next = clampForItem(
      item,
      origin.x + event.delta.x,
      origin.y + event.delta.y
    );
    const logical = renderedToLogical(next.x, next.y, areaSize.width);
    onItemMove(item.id, logical.x, logical.y);
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
    const dims = getRenderedDimensions(item);

    const props = {
      item,
      mode,
      isSelected: selectedId === item.id,
      isHuntTarget: isEdit && targetSet.has(item.id),
      isUnlocked: unlockedIds?.has(item.id) ?? false,
      onSelect: () => onSelectItem?.(item.id),
      onUnlock: () => onUnlockItem?.(item.id),
      renderDimensions: dims,
    };

    const inner = <Component {...props} />;

    if (canDrag) {
      return (
        <DraggableDeskItem
          key={item.id}
          id={item.id}
          x={pos.x}
          y={pos.y}
          width={dims.width}
          height={dims.height}
          rotation={item.rotation}
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
        width={dims.width}
        height={dims.height}
        rotation={item.rotation}
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
      {isEdit && showRulesCard && <ScrapbookRulesCard />}

      {isEdit && huntTargetIds && (
        <div
          className="absolute bottom-2 right-2 z-20 border-2 px-2 py-1 text-[10px] font-bold font-display filter-hand-drawn pointer-events-none"
          style={{
            borderColor: "#3F220F",
            backgroundColor:
              huntTargetIds.length >= HUNT_TARGET_COUNT ? "#d1fae5" : "#FEF3C7",
            color: "#3F220F",
          }}
        >
          🎯 {huntTargetIds.length}/{HUNT_TARGET_COUNT} targets
        </div>
      )}

      <DeskSurface
        showGrid={showGrid && !isView}
        readonly={isView}
        label={surfaceLabel}
        hideLabel={hideSurfaceLabel}
        variant={surfaceVariant ?? (isView ? "topdown" : "default")}
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

      {isView && !hideViewOverlay && (
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
