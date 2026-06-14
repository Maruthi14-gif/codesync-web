'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function Home() {
  const [roomIdInput, setRoomIdInput] = useState('');
  const router = useRouter();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = roomIdInput.trim();
    if (trimmed) {
      router.push(`/room/${trimmed}`);
    }
  };
  return (
    <div className="relative flex flex-col flex-1 items-center justify-center min-h-screen bg-neutral-950 text-white font-sans overflow-hidden selection:bg-teal-500/30 selection:text-teal-200">
      {/* Background gradients for premium styling */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,184,166,0.15),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.05),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.05),transparent_40%)]" />

      <main className="relative z-10 flex flex-col items-center justify-center max-w-xl px-6 text-center">
        {/* Decorative Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/5 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
          <span className="font-mono text-teal-400">&gt;_</span> Real-time Collaboration
        </div>

        {/* Title */}
        <h1 className="text-7xl md:text-8xl font-anton tracking-wide text-[#D2E823] uppercase mb-4 drop-shadow-md">
          codesync
        </h1>

        {/* Pitch */}
        <p className="text-lg md:text-xl text-neutral-400 font-medium max-w-md mb-8 leading-relaxed">
          Sync files, share cursor presence, and code collaboratively in real-time with built-in AI autocomplete.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md mt-4">
          <Link
            href="/create"
            className="w-full sm:flex-1 relative inline-flex items-center justify-center px-6 py-4 rounded-xl font-bold bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-black shadow-lg shadow-teal-500/25 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer text-center"
          >
            Create a Room
          </Link>

          <Dialog>
            <DialogTrigger className="w-full sm:flex-1 relative inline-flex items-center justify-center px-6 py-4 rounded-xl font-bold border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-850 text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer text-center">
              Join a Room
            </DialogTrigger>
            <DialogContent className="border border-neutral-850 bg-neutral-950 p-6 rounded-2xl max-w-sm w-full shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-anton uppercase tracking-wider text-white">
                  Join Workspace
                </DialogTitle>
                <DialogDescription className="text-neutral-450 mt-1 text-xs">
                  Enter a Room ID to collaborate with your team in real-time.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleJoin} className="mt-4 flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="e.g., k9L2P5v8"
                  value={roomIdInput}
                  onChange={(e) => setRoomIdInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-850 bg-neutral-900 text-white placeholder-neutral-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all font-mono text-sm"
                  required
                  autoFocus
                />

                <div className="flex justify-end gap-3 mt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg font-bold bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-black shadow-lg shadow-teal-500/10 transition-all duration-200 cursor-pointer text-xs uppercase tracking-wider"
                  >
                    Join Room
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}
