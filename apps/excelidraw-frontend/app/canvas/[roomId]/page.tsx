export const dynamic = "force-dynamic";

import { RoomCanvas } from "@/components/RoomCanvas";
//@ts-expect-error
export default async function CanvasPage({ params }) {
  const { roomId } = await params; // ✅ Ab ye Promise hai
  return <RoomCanvas roomId={roomId} />;
}
