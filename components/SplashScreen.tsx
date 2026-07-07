'use client';

import { useEffect, useState } from 'react';
import { Hand, Handshake, Code2 } from 'lucide-react';

const SPLASH_SEEN_KEY = 'codesync-splash-seen';
const LEAVE_AT_MS = 2400;
const UNMOUNT_AT_MS = 2900;

/**
 * Brand intro overlay: two hands reach in from the sides and meet in a
 * handshake, then the wordmark fades up and the overlay dissolves.
 * Shown once per browser session; click anywhere to skip.
 *
 * Rendered visible on the server so first paint is the splash (no landing
 * flash); repeat visitors get it removed on mount via sessionStorage.
 */
export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SPLASH_SEEN_KEY)) {
      setVisible(false);
      return;
    }
    // The seen-flag is set on completion/skip, not here: setting it at mount
    // makes StrictMode's second dev effect run read it and kill the splash.
    const leaveTimer = setTimeout(() => setLeaving(true), LEAVE_AT_MS);
    const unmountTimer = setTimeout(() => {
      sessionStorage.setItem(SPLASH_SEEN_KEY, '1');
      setVisible(false);
    }, UNMOUNT_AT_MS);
    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!visible) return null;

  const skip = () => {
    sessionStorage.setItem(SPLASH_SEEN_KEY, '1');
    setVisible(false);
  };

  return (
    <div
      onClick={skip}
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-10 bg-[#060a08] cursor-pointer select-none transition-opacity duration-500 ${
        leaving ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient glow, matching the landing page */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(16,185,129,0.07),transparent_55%)] pointer-events-none" />

      {/* Handshake stage */}
      <div className="relative flex items-center justify-center w-56 h-28">
        <Hand size={44} className="splash-hand-l absolute text-emerald-400" strokeWidth={1.75} />
        <Hand size={44} className="splash-hand-r absolute text-teal-400" strokeWidth={1.75} />
        <span className="splash-ring absolute w-20 h-20 rounded-full border-2 border-emerald-400/60" />
        <span className="splash-shake absolute flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/25">
          <Handshake size={38} className="text-emerald-400" strokeWidth={1.75} />
        </span>
      </div>

      {/* Wordmark + tagline */}
      <div className="relative flex flex-col items-center gap-3">
        <div className="splash-rise [animation-delay:1.45s] flex items-center gap-2">
          <Code2 className="text-[#10b981]" size={26} />
          <span className="text-2xl font-anton tracking-wide uppercase text-[#F5F0E1]">
            code<span className="text-[#10b981]">sync</span>
          </span>
        </div>
        <span className="splash-rise [animation-delay:1.65s] text-[11px] font-semibold uppercase tracking-[0.35em] text-neutral-500">
          Connecting coders
        </span>
      </div>
    </div>
  );
}
