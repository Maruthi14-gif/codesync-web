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
    <div className="flex flex-col h-full border border-neutral-200 rounded-xl overflow-hidden shadow-2xl bg-white text-neutral-900">
      {/* Notepad Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-200 bg-neutral-50 text-xs text-neutral-600 font-sans select-none">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-neutral-700">
          <Notebook size={14} className="text-neutral-500" />
          <span>Notes / Scratchpad</span>
        </div>
        <div>
          <span className="text-[10px] bg-neutral-200 text-neutral-600 px-2 py-0.5 rounded font-mono font-semibold">
            Notepad
          </span>
        </div>
      </div>

      {/* Plain Text Textarea */}
      <textarea
        ref={textareaRef}
        placeholder="Write brainstorm ideas, draft outlines, or rough notes here... edits sync automatically."
        className="flex-1 w-full p-4 resize-none bg-white text-neutral-900 font-sans text-sm focus:outline-none placeholder:text-neutral-400 leading-relaxed"
      />
    </div>
  );
}
