import { RoomLayout } from "@/components/room/RoomLayout";

export default function RoomPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-serif font-bold text-amber-950">
          Our Room
        </h1>
        <p className="text-sm text-stone-500">
          Shared nook above · messy desks below
        </p>
      </div>
      <RoomLayout />
    </div>
  );
}
