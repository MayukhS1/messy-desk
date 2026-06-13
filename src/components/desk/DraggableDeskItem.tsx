"use client";

import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

export function DraggableDeskItem({
  id,
  x,
  y,
  width,
  height,
  rotation,
  zIndex,
  disabled,
  children,
}: {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled,
  });

  const dragRotation = isDragging ? rotation + (rotation >= 0 ? 3 : -3) : rotation;
  const dragScale = isDragging ? 1.06 : 1;

  const style: React.CSSProperties = {
    position: "absolute",
    left: x,
    top: y,
    width,
    height,
    zIndex: isDragging ? 1000 : zIndex,
    transform: `rotate(${dragRotation}deg) scale(${dragScale})`,
    transformOrigin: "center center",
    touchAction: disabled ? "auto" : "none",
    filter: isDragging
      ? "drop-shadow(0 12px 16px rgba(137, 84, 53, 0.45))"
      : undefined,
    transition: isDragging ? undefined : "filter 0.15s ease",
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
  width,
  height,
  rotation,
  zIndex,
  children,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        zIndex,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </div>
  );
}
