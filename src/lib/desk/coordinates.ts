import type { HuntItemType } from "@/types/database";
import { getItemLogicalBounds } from "@/lib/desk/itemDimensions";

/** Logical desk plane — matches editor preview aspect ratio (16:9). */
export const DESK_LOGICAL_WIDTH = 1920;
export const DESK_LOGICAL_HEIGHT = 1080;

/** Typical inner content area when legacy pixel coords were saved. */
export const LEGACY_INNER_WIDTH = 824;
export const LEGACY_INNER_HEIGHT = 420;

/** Coords at or below this on both axes are treated as legacy pixel space. */
export const LEGACY_COORD_MAX = 960;

/** WCAG-friendly minimum touch/read size on rendered canvas. */
export const MIN_ITEM_RENDER_SIZE = 48;

/** @deprecated Use per-type bounds from itemDimensions.ts */
export const DEFAULT_ITEM_BASE_SIZE = 150;

/** Snapping grid step in logical space (maps to ~40px at reference width). */
export const DESK_GRID_LOGICAL_STEP = 80;

export function getDeskScale(renderWidth: number): number {
  if (renderWidth <= 0) return 1;
  return renderWidth / DESK_LOGICAL_WIDTH;
}

export function isLegacyCoordinate(x: number, y: number): boolean {
  return x <= LEGACY_COORD_MAX && y <= LEGACY_COORD_MAX;
}

export function legacyToLogical(x: number, y: number): { x: number; y: number } {
  return {
    x: (x / LEGACY_INNER_WIDTH) * DESK_LOGICAL_WIDTH,
    y: (y / LEGACY_INNER_HEIGHT) * DESK_LOGICAL_HEIGHT,
  };
}

export function toLogicalCoordinates(x: number, y: number): { x: number; y: number } {
  if (isLegacyCoordinate(x, y)) {
    return legacyToLogical(x, y);
  }
  return { x, y };
}

export function logicalToRendered(
  logicalX: number,
  logicalY: number,
  renderWidth: number
): { x: number; y: number } {
  const s = getDeskScale(renderWidth);
  return {
    x: Math.round(logicalX * s),
    y: Math.round(logicalY * s),
  };
}

export function renderedToLogical(
  renderedX: number,
  renderedY: number,
  renderWidth: number
): { x: number; y: number } {
  const s = getDeskScale(renderWidth);
  if (s <= 0) return { x: renderedX, y: renderedY };
  return {
    x: Math.round(renderedX / s),
    y: Math.round(renderedY / s),
  };
}

/** Clamped rendered width/height — positions still use raw S. */
export function getItemRenderedDimensions(
  itemType: HuntItemType,
  renderWidth: number,
  itemScale = 1
): { width: number; height: number } {
  const bounds = getItemLogicalBounds(itemType);
  const s = getDeskScale(renderWidth);
  return {
    width: Math.round(
      Math.max(bounds.width * s * itemScale, MIN_ITEM_RENDER_SIZE)
    ),
    height: Math.round(
      Math.max(bounds.height * s * itemScale, MIN_ITEM_RENDER_SIZE)
    ),
  };
}

/** Uniform visual scale for legacy transform paths (uses max dimension). */
export function getItemVisualScale(
  renderWidth: number,
  itemScale = 1,
  baseSize = DEFAULT_ITEM_BASE_SIZE
): number {
  if (renderWidth <= 0) return itemScale;
  const s = getDeskScale(renderWidth);
  const minScale = MIN_ITEM_RENDER_SIZE / baseSize;
  return itemScale * Math.max(s, minScale);
}

export function getItemVisualScaleForType(
  itemType: HuntItemType,
  renderWidth: number,
  itemScale = 1
): number {
  return getItemVisualScale(
    renderWidth,
    itemScale,
    getItemLogicalBounds(itemType).width
  );
}

export function scaledItemSize(
  itemType: HuntItemType,
  renderWidth: number,
  itemScale = 1
): { width: number; height: number } {
  return getItemRenderedDimensions(itemType, renderWidth, itemScale);
}
