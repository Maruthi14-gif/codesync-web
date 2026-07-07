'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { Button } from '@/components/ui/button';
import { Terminal, Zap, MousePointer, Code2, ExternalLink } from 'lucide-react';
import SplashScreen from '@/components/SplashScreen';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Beams ride the 40px background grid, so offsets are multiples of 40.
// Negative delays start each beam mid-flight on first paint.
const BEAMS_X: { top: number; duration: number; delay: number; teal?: boolean }[] = [
  { top: 120, duration: 11, delay: -3 },
  { top: 240, duration: 14, delay: -9, teal: true },
  { top: 400, duration: 9, delay: -1 },
  { top: 520, duration: 13, delay: -6, teal: true },
  { top: 680, duration: 12, delay: -10 },
];

const BEAMS_Y: { left: number; duration: number; delay: number; teal?: boolean }[] = [
  { left: 200, duration: 10, delay: -2, teal: true },
  { left: 440, duration: 13, delay: -7 },
  { left: 720, duration: 9, delay: -4 },
  { left: 1000, duration: 14, delay: -11, teal: true },
];

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [roomIdInput, setRoomIdInput] = useState('');

  const handleCreateRoom = () => {
    setLoading(true);
    const roomId = nanoid(10);
    router.push(`/room/${roomId}`);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = roomIdInput.trim();
    if (trimmed) {
      router.push(`/room/${trimmed}`);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-[#060a08] text-[#ecf0ed] font-sans overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      <SplashScreen />
      {/* Background gradients for premium styling (Linear + Supabase style) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,rgba(16,185,129,0.06),transparent_60%)] pointer-events-none" />

      {/* Drifting aurora orbs */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <span className="glow-orb w-[32rem] h-[32rem] -top-40 -left-24 bg-emerald-500/[0.07] blur-[110px]" style={{ animationDuration: '32s' }} />
        <span className="glow-orb w-[26rem] h-[26rem] -bottom-32 -right-16 bg-teal-500/[0.06] blur-[100px]" style={{ animationDuration: '38s', animationDelay: '-14s' }} />
        <span className="glow-orb w-[22rem] h-[22rem] top-1/3 left-1/2 bg-emerald-400/[0.05] blur-[90px]" style={{ animationDuration: '26s', animationDelay: '-7s' }} />
      </div>

      {/* Mesh Grid Lines Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_55%,transparent_100%)] pointer-events-none" />

      {/* Sync beams: light packets racing along the grid lines (same mask as the grid) */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_55%,transparent_100%)]">
        {BEAMS_X.map((b) => (
          <span
            key={`x-${b.top}`}
            className={`grid-beam-x${b.teal ? ' beam-teal' : ''}`}
            style={{ top: b.top, animationDuration: `${b.duration}s`, animationDelay: `${b.delay}s` }}
          />
        ))}
        {BEAMS_Y.map((b) => (
          <span
            key={`y-${b.left}`}
            className={`grid-beam-y${b.teal ? ' beam-teal' : ''}`}
            style={{ left: b.left, animationDuration: `${b.duration}s`, animationDelay: `${b.delay}s` }}
          />
        ))}
      </div>

      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col">
        {/* Top Header/Logo */}
        <div className="flex items-center gap-2 justify-center md:justify-start w-full">
          <Code2 className="text-[#10b981]" size={28} />
          <h1 className="text-xl font-anton tracking-wide uppercase text-[#F5F0E1] flex items-center gap-1">
            <span>code</span>
            <span className="text-[#10b981]">sync</span>
          </h1>
        </div>

        {/* Hero — sits directly on the animated background */}
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-8 py-16">
          {/* Live Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Live Collaboration</span>
          </div>

          {/* Pitch with Anton display font settled on the Cream treatment */}
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-5xl sm:text-7xl font-anton uppercase tracking-[-0.03em] leading-[0.95] max-w-2xl text-[#F5F0E1]">
              Write code. <br />
              <span className="text-[#F5F0E1]/80">Think as one.</span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 font-medium max-w-md leading-relaxed">
              A shared room where your whole team codes as one. Live cursors, instant sync, zero conflicts.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center w-full max-w-md">
            <Button
              onClick={handleCreateRoom}
              disabled={loading}
              className="emerald-glow-btn w-full sm:flex-1 px-8 py-6 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-[#060a08] transition-all duration-300 active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-base"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 rounded-full border-2 border-[#060a08] border-t-transparent animate-spin" />
                  <span>Creating workspace...</span>
                </>
              ) : (
                <>
                  <span>Create a Room</span>
                  <span className="text-lg">→</span>
                </>
              )}
            </Button>

            <Dialog>
              <DialogTrigger render={
                <Button
                  variant="outline"
                  className="w-full sm:flex-1 px-8 py-6 rounded-xl font-bold border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-white transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center gap-2 text-base"
                >
                  Join a Room
                </Button>
              } />
              <DialogContent className="border border-white/10 bg-[#060a08] p-6 rounded-2xl max-w-sm w-full shadow-2xl text-[#ecf0ed]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-anton uppercase tracking-wider text-[#F5F0E1]">
                    Join Workspace
                  </DialogTitle>
                  <DialogDescription className="text-neutral-400 mt-1 text-xs">
                    Enter a Room ID to collaborate with your team in real-time.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleJoin} className="mt-4 flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="e.g., k9L2P5v8"
                    value={roomIdInput}
                    onChange={(e) => setRoomIdInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-white placeholder-neutral-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all font-mono text-sm"
                    required
                    autoFocus
                  />

                  <div className="flex justify-end gap-3 mt-2">
                    <Button
                      type="submit"
                      className="px-5 py-2.5 rounded-lg font-bold bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-black shadow-lg shadow-teal-500/10 transition-all duration-200 cursor-pointer text-xs uppercase tracking-wider"
                    >
                      Join Room
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Feature strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <MousePointer size={13} className="text-emerald-400 shrink-0" />
              <span>Live cursors &amp; presence</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={13} className="text-emerald-400 shrink-0" />
              <span>Zero-conflict CRDT sync</span>
            </div>
            <div className="flex items-center gap-2">
              <Terminal size={13} className="text-emerald-400 shrink-0" />
              <span>Run code, share output live</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 pb-2 text-xs text-neutral-500">
          <span>Built with Next.js, Yjs &amp; CodeMirror.</span>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Maruthi14-gif/codesync-web"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <ExternalLink size={13} />
              <span>Frontend</span>
            </a>
            <a
              href="https://github.com/Maruthi14-gif/codesync-server"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <ExternalLink size={13} />
              <span>Backend</span>
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
