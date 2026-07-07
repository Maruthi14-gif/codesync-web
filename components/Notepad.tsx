'use client';

import { useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { bindTextarea } from '@/lib/textarea-binding';
import { Notebook } from 'lucide-react';

interface NotepadProps {
  ytext: Y.Text;
}

export default function Notepad({ ytext }: NotepadProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Bind local textarea value updates and remote Y.Text events
    const unbind = bindTextarea(textarea, ytext);

    return () => {
      unbind();
    };
  }, [ytext]);

  return (
    <div className="flex flex-col h-full border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl bg-white/[0.03] backdrop-blur-md">
      {/* Notepad Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.08] bg-black/40 text-xs text-neutral-400 font-sans select-none">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-neutral-300">
          <Notebook size={14} className="text-amber-300/80" />
          <span>Notes / Scratchpad</span>
        </div>
        <div>
          <span className="text-[10px] bg-white/[0.06] text-neutral-400 px-2 py-0.5 rounded font-mono font-semibold">
            Shared
          </span>
        </div>
      </div>

      {/* Plain Text Textarea */}
      <textarea
        ref={textareaRef}
        placeholder="Write brainstorm ideas, draft outlines, or rough notes here... edits sync automatically."
        className="flex-1 w-full p-4 resize-none bg-transparent text-neutral-200 font-sans text-sm focus:outline-none placeholder:text-neutral-500 leading-relaxed selection:bg-amber-500/20"
      />
    </div>
  );
}
