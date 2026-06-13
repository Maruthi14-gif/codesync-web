'use client';

import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { oneDark } from '@codemirror/theme-one-dark';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { yCollab } from 'y-codemirror.next';
import { Extension } from '@codemirror/state';
import { LanguageKey, languages } from '@/lib/languages';

interface EditorProps {
  roomId: string;
  language: LanguageKey;
  ytext: Y.Text;
  provider: WebsocketProvider;
  localUser: { name: string; color: string };
}

export default function Editor({ roomId, language, ytext, provider, localUser }: EditorProps) {
  // Extensions list:
  // - Current selected language
  // - yCollab for real-time document synchronization and shared cursors
  // - line wrapping to prevent horizontal text clipping
  const extensions: Extension[] = [
    languages[language]?.extension || languages.javascript.extension,
    yCollab(ytext, provider.awareness),
    EditorView.lineWrapping,
  ];

  return (
    <div className="flex flex-1 flex-col h-full border border-neutral-850 rounded-xl overflow-hidden shadow-2xl bg-neutral-900">
      {/* Local Session Status Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-850 bg-neutral-950 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Connected as <strong style={{ color: localUser.color }}>{localUser.name}</strong></span>
        </div>
        <div>
          <span>Workspace ID: <strong className="text-neutral-200">{roomId}</strong></span>
        </div>
      </div>

      {/* CodeMirror Editor container */}
      <CodeMirror
        theme={oneDark}
        height="100%"
        className="flex-1 text-sm outline-none overflow-auto"
        extensions={extensions}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
        }}
      />
    </div>
  );
}
