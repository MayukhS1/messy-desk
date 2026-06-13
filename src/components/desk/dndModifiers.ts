import type { Modifier } from "@dnd-kit/core";

/** Restrict drag transform to an explicit screen-space rectangle. */
export function createRestrictToRect(
  getRect: () => DOMRect | null
): Modifier {
  return ({ transform, draggingNodeRect }) => {
    const rect = getRect();
    if (!rect || !draggingNodeRect) {
      return transform;
    }

    const next = { ...transform };

    if (draggingNodeRect.left + transform.x < rect.left) {
      next.x = rect.left - draggingNodeRect.left;
    } else if (draggingNodeRect.right + transform.x > rect.right) {
      next.x = rect.right - draggingNodeRect.right;
    }

    if (draggingNodeRect.top + transform.y < rect.top) {
      next.y = rect.top - draggingNodeRect.top;
    } else if (draggingNodeRect.bottom + transform.y > rect.bottom) {
      next.y = rect.bottom - draggingNodeRect.bottom;
    }

    return next;
  };
}

export function clampDeskPosition(
  x: number,
  y: number,
  areaWidth: number,
  areaHeight: number,
  itemWidth: number,
  itemHeight: number = itemWidth
) {
  const maxX = Math.max(0, areaWidth - itemWidth);
  const maxY = Math.max(0, areaHeight - itemHeight);
  return {
    x: Math.round(Math.max(0, Math.min(maxX, x))),
    y: Math.round(Math.max(0, Math.min(maxY, y))),
  };
}
