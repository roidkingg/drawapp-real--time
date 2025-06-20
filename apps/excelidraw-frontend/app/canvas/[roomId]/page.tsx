export const dynamic = "force-dynamic";

import { RoomCanvas } from "@/components/RoomCanvas";

type CanvasPageProps = {
  params: {
    roomId: string;
  };
};

export default function CanvasPage({ params }: CanvasPageProps) {
  const { roomId } = params;

  return <RoomCanvas roomId={roomId} />;
}
