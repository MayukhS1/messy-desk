import type { ComponentType } from "react";
import type { DeskItem } from "@/types/database";

export interface ItemInteractionProps {
  item: DeskItem;
  mode: "edit" | "explore" | "view";
  isUnlocked: boolean;
  onUnlock: () => void;
  onSelect?: () => void;
  isSelected?: boolean;
}

export type HuntItemComponent = ComponentType<ItemInteractionProps>;
