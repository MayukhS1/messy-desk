import type { HuntItemType } from "@/types/database";
import type { HuntItemComponent } from "@/types/items";
import {
  LaptopItem,
  EnvelopeItem,
  BoxItem,
  BookItem,
  MugItem,
  StickyNoteItem,
} from "@/components/items/hunt/HuntItems";

export const huntItemRegistry: Record<HuntItemType, HuntItemComponent> = {
  laptop: LaptopItem,
  envelope: EnvelopeItem,
  box: BoxItem,
  book: BookItem,
  mug: MugItem,
  sticky_note: StickyNoteItem,
};

export function validateUnlock(
  item: { unlock_config: { type: string; pin?: string; combination?: string } },
  input?: string
): boolean {
  const config = item.unlock_config;
  switch (config.type) {
    case "pin":
      return input === config.pin;
    case "combination":
      return input === config.combination;
    case "none":
      return true;
    default:
      return false;
  }
}
