import { redirect } from 'next/navigation';
import { nanoid } from 'nanoid';

export const dynamic = 'force-dynamic';

export default function CreateRoomPage() {
  redirect(`/room/${nanoid(10)}`);
}
