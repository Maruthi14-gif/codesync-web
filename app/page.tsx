'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { Button } from '@/components/ui/button';
import { Terminal, Zap, MousePointer, Layers, Code2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#060a08] text-[#ecf0ed] font-sans overflow-x-hidden py-12 selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background gradients for premium styling (Linear + Supabase style) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,rgba(16,185,129,0.06),transparent_60%)] pointer-events-none" />
      
      {/* Mesh Grid Lines Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />

      <main className="relative z-10 w-full max-w-6xl px-4 sm:px-6 flex flex-col gap-8">
        
        {/* Top Header/Logo */}
        <div className="flex items-center gap-2 justify-center md:justify-start w-full">
          <Code2 className="text-[#10b981]" size={28} />
          <h1 className="text-xl font-anton tracking-wide uppercase text-white flex items-center gap-1">
            <span>code</span>
            <span className="text-[#10b981]">sync</span>
          </h1>
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
              <div className="flex flex-col gap-3">
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.1] max-w-lg">
                  Write code. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-300">
                    Think as one.
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-neutral-400 font-medium max-w-md leading-relaxed mt-2">
                  A shared room where your whole team codes as one. Live cursors, instant sync, zero conflicts.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
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
                    <DialogTitle className="text-xl font-anton uppercase tracking-wider text-white">
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
          </div>

          {/* Card 2: Yjs CRDT Sync (Spans 1 column) */}
          <div className="bento-card-hover bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-8 flex flex-col gap-4 relative overflow-hidden">
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 w-fit">
              <Zap className="text-emerald-400 w-6 h-6" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-white">Conflict-Free Sync</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Powered by Yjs CRDTs. Every keystroke is merged automatically, ensuring all peers see the exact same document state with zero lag.
              </p>
            </div>
          </div>

          {/* Card 3: Cursor Presence */}
          <div className="bento-card-hover bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-8 flex flex-col gap-4 relative overflow-hidden">
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 w-fit">
              <MousePointer className="text-emerald-400 w-6 h-6" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-white">Live Presence</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Track collaborator cursors, selection highlights, and active presence states in real-time, built completely on light-weight awareness protocols.
              </p>
            </div>
          </div>

          {/* Card 4: Shared Notepad */}
          <div className="bento-card-hover bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-8 flex flex-col gap-4 relative overflow-hidden">
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 w-fit">
              <Layers className="text-emerald-400 w-6 h-6" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-white">Split Surfaces</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Edit code inside the main CodeMirror panel while planning project details in the notepad. Dual independent surfaces stored on a single Yjs doc.
              </p>
            </div>
          </div>

          {/* Card 5: Interactive Terminal Visualizer */}
          <div className="bento-card-hover bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 flex flex-col justify-between gap-4 relative overflow-hidden">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-black/20 w-fit text-[10px] font-mono text-neutral-400 uppercase select-none tracking-wider">
              <Terminal size={12} className="text-emerald-400" />
              <span>Console Logs</span>
            </div>

            <div className="font-mono text-[11px] text-neutral-400 bg-black/40 p-4 rounded-xl border border-white/5 flex-1 select-none flex flex-col justify-center gap-2">
              <div>
                <span className="text-emerald-500/95">$</span> npx codesync init
              </div>
              <div className="text-neutral-500 pl-2">Initializing collaborative document...</div>
              <div className="text-neutral-500 pl-2">Connected to server: port 1234</div>
              <div>
                <span className="text-emerald-500/95">$</span> get-peers
              </div>
              <div className="text-neutral-300 pl-2">✓ Tim Berners-Lee connected</div>
              <div className="text-neutral-300 pl-2">✓ Grace Hopper connected</div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
