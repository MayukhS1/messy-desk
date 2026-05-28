import { RoomLayout } from "@/components/room/RoomLayout";

export default function RoomPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Our Room
        </h1>
        <p className="text-sm text-muted font-display">
          Shared nook above · messy desks below
        </p>
      </div>
      <RoomLayout />
    </div>
  );
}
