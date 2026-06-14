'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Terminal } from 'lucide-react';

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
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#060a08] text-[#ecf0ed] font-sans overflow-x-hidden py-12 selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background gradients for premium styling (Linear + Supabase style) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,rgba(16,185,129,0.06),transparent_60%)] pointer-events-none" />

      {/* Mesh Grid Lines Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />

      <main className="relative z-10 flex flex-col items-center justify-center max-w-xl px-6 text-center">
        {/* Decorative Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/5 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
          <Terminal size={14} className="text-teal-400" /> Real-time Collaboration
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1: Bento Hero Card (Spans 2 columns) */}
          <div className="md:col-span-2 relative overflow-hidden bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-10 flex flex-col justify-between gap-8 min-h-[350px]">
            {/* Faint ambient glow inside the card */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/[0.05] rounded-full blur-[80px] pointer-events-none" />

            <div className="flex flex-col gap-6 items-start">
              {/* Live Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Live Collaboration</span>
              </div>

              {/* Pitch */}
              <p className="text-lg md:text-xl text-neutral-400 font-medium max-w-md mb-8 leading-relaxed">
                Sync files, share cursor presence, and code collaboratively in real-time with built-in AI autocomplete.
              </p>

              {/* Button */}
              <Button
                onClick={handleCreateRoom}
                disabled={loading}
                size="lg"
                className="relative px-8 py-6 rounded-xl font-bold bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-black shadow-lg shadow-teal-500/25 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Creating...' : 'Create a Room'}
              </Button>
            </main>
          </div>
          );
}
