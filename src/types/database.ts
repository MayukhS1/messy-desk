export type DeskStatus = "draft" | "published";
export type HuntStatus = "active" | "completed";

export type HuntItemType =
  | "laptop"
  | "envelope"
  | "box"
  | "book"
  | "mug"
  | "sticky_note";

export type SharedItemType =
  | "journal"
  | "record_player"
  | "flora_vase"
  | "haptic_photo_frame";

export type UnlockType =
  | "pin"
  | "combination"
  | "sequence_clicks"
  | "drag_reveal"
  | "none";

export interface UnlockConfig {
  type: UnlockType;
  pin?: string;
  combination?: string;
  clicksRequired?: number;
}

export interface HotspotConfig {
  id: string;
  x: number;
  y: number;
  radius: number;
  pattern: number[];
  message?: string;
}

export interface SharedItemConfig {
  photoUrl?: string;
  hotspots?: HotspotConfig[];
}

export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Desk {
  id: string;
  owner_id: string;
  layout_meta: Record<string, unknown>;
  max_capacity: number;
  status: DeskStatus;
  published_at: string | null;
}

export interface DeskItem {
  id: string;
  desk_id: string;
  item_type: HuntItemType;
  pos_x: number;
  pos_y: number;
  rotation: number;
  z_index: number;
  scale: number;
  unlock_config: UnlockConfig;
  hidden_message: string;
  hint: string | null;
  is_hunt_eligible: boolean;
  is_hunt_target: boolean;
  media_url: string | null;
  label: string | null;
}

export interface Hunt {
  id: string;
  hunter_id: string;
  desk_owner_id: string;
  status: HuntStatus;
  started_at: string;
  completed_at: string | null;
}

export interface HuntTarget {
  id: string;
  hunt_id: string;
  desk_item_id: string;
  sort_order: number;
  found_at: string | null;
  desk_item?: DeskItem;
}

export interface Couple {
  id: string;
  user_a_id: string;
  user_b_id: string | null;
  invite_code: string;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  couple_id: string;
  author_id: string;
  content_md: string;
  created_at: string;
  updated_at: string;
}

export interface JournalLock {
  couple_id: string;
  locked_by: string;
  expires_at: string;
}

export interface RelationshipStats {
  couple_id: string;
  messages_7d: number;
  messages_30d: number;
  flora_stage: number;
  last_activity_at: string | null;
}

export interface PlaylistTrack {
  id: string;
  couple_id: string;
  title: string;
  storage_url: string;
  sort_order: number;
}

export interface SharedSpaceItem {
  id: string;
  couple_id: string;
  item_type: SharedItemType;
  slot_id: string;
  config: SharedItemConfig;
  updated_at: string;
}

export interface TurntableState {
  trackId: string;
  isPlaying: boolean;
  positionMs: number;
  updatedAt: number;
  leaderId: string;
}
