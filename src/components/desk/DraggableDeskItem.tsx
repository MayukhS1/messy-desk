"use client";

import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

export function DraggableDeskItem({
  id,
  x,
  y,
  rotation,
  scale,
  zIndex,
  disabled,
  children,
}: {
  id: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  zIndex: number;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled,
  });

  const style: React.CSSProperties = {
    position: "absolute",
    left: x,
    top: y,
    zIndex: isDragging ? 1000 : zIndex,
    transform: `rotate(${rotation}deg) scale(${scale})`,
    touchAction: disabled ? "auto" : "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        !disabled && "cursor-grab active:cursor-grabbing",
        isDragging && "z-[1000]"
      )}
      {...(disabled ? {} : { ...listeners, ...attributes })}
    >
      {children}
    </div>
  );
}

export function StaticDeskItem({
  x,
  y,
  rotation,
  scale,
  zIndex,
  children,
}: {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  zIndex: number;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        zIndex,
        transform: `rotate(${rotation}deg) scale(${scale})`,
      }}
    >
      {children}
    </div>
  );
}
