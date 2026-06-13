'use client';

import { useParams } from 'next/navigation';

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-neutral-950 text-white font-sans">
      <h1 className="text-3xl font-bold">Room: {roomId}</h1>
      <p className="text-neutral-400 mt-2">Collaboration workspace setup in progress...</p>
    </div>
  );
}
