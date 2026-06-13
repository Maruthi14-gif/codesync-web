'use client';

import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Terminal } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = () => {
    setLoading(true);
    const roomId = nanoid(10);
    router.push(`/room/${roomId}`);
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
          <Terminal size={14} className="text-teal-400" /> Real-time Collaboration
        </div>

        {/* Title */}
        <h1 className="text-7xl md:text-8xl font-anton tracking-wide text-[#D2E823] uppercase mb-4 drop-shadow-md">
          codesync
        </h1>

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
