'use client';

import { useEffect, useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { oneDark } from '@codemirror/theme-one-dark';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { yCollab } from 'y-codemirror.next';
import { Extension } from '@codemirror/state';
import { getRandomUser } from '@/lib/user';
import { languages, LanguageKey } from '@/lib/languages';

interface PresenceUser {
  clientId: number;
  name: string;
  color: string;
}

interface EditorProps {
  roomId: string;
  language: LanguageKey;
  onPresenceChange?: (users: PresenceUser[]) => void;
}

export default function Editor({ roomId, language, onPresenceChange }: EditorProps) {
  const [ydoc, setYdoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [ytext, setYtext] = useState<Y.Text | null>(null);
  const [localUser, setLocalUser] = useState<{ name: string; color: string } | null>(null);

  // Avoid re-triggering effects by keeping track of the callback in a ref
  const onPresenceChangeRef = useRef(onPresenceChange);
  useEffect(() => {
    onPresenceChangeRef.current = onPresenceChange;
  }, [onPresenceChange]);

  useEffect(() => {
    // 1. Initialize Yjs document and the shared text type
    const doc = new Y.Doc();
    const text = doc.getText('codemirror');

    // 2. Generate local presence user details
    const user = getRandomUser();
    setLocalUser(user);

    // 3. Connect to the Websocket server for real-time sync
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:1234';
    console.log(`Connecting room: ${roomId} using server: ${wsUrl}`);
    const wsProvider = new WebsocketProvider(wsUrl, roomId, doc);

    // Set local presence fields on awareness state
    wsProvider.awareness.setLocalStateField('user', {
      name: user.name,
      color: user.color,
    });

    setYdoc(doc);
    setProvider(wsProvider);
    setYtext(text);

    // 4. Awareness change handler to notify container page of active collaborators
    const handleAwarenessChange = () => {
      const states = wsProvider.awareness.getStates();
      const users: PresenceUser[] = [];
      states.forEach((state: any, clientId: number) => {
        if (state.user) {
          users.push({
            clientId,
            name: state.user.name,
            color: state.user.color,
          });
        }
      });
      if (onPresenceChangeRef.current) {
        onPresenceChangeRef.current(users);
      }
    };

    wsProvider.awareness.on('change', handleAwarenessChange);
    // Initialize presence list
    handleAwarenessChange();

    // 5. Cleanup connections on component unmount
    return () => {
      wsProvider.awareness.off('change', handleAwarenessChange);
      wsProvider.disconnect();
      wsProvider.destroy();
      doc.destroy();
    };
  }, [roomId]);

  if (!ydoc || !provider || !ytext || !localUser) {
    return (
      <div className="flex flex-1 items-center justify-center bg-neutral-900 text-neutral-400">
        <div className="flex flex-col items-center gap-2">
          <span className="w-6 h-6 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
          <span className="text-xs font-semibold uppercase tracking-wider animate-pulse">
            Connecting to Sync Server...
          </span>
        </div>
      </div>
    );
  }

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
