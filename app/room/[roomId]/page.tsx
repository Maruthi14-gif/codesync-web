'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ArrowLeft, Users, Code2, Share2, Check, Play, Terminal } from 'lucide-react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { Button } from '@/components/ui/button';
import { LanguageKey, languages } from '@/lib/languages';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getRandomUser } from '@/lib/user';

// Dynamically import client-only Yjs-bound components
const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });
const Notepad = dynamic(() => import('@/components/Notepad'), { ssr: false });
const OutputPanel = dynamic(() => import('@/components/OutputPanel'), { ssr: false });

interface PresenceUser {
  clientId: number;
  name: string;
  color: string;
}

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;

  const [language, setLanguage] = useState<LanguageKey>('javascript');
  const [copied, setCopied] = useState(false);
  const [presenceUsers, setPresenceUsers] = useState<PresenceUser[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');

  // Yjs connection state
  const [ydoc, setYdoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [codeText, setCodeText] = useState<Y.Text | null>(null);
  const [noteText, setNoteText] = useState<Y.Text | null>(null);
  const [outputText, setOutputText] = useState<Y.Text | null>(null);
  const [localUser, setLocalUser] = useState<{ name: string; color: string } | null>(null);

  const [outputData, setOutputData] = useState<{ stdout: string; stderr: string; runBy: string; language: string } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isOutputOpen, setIsOutputOpen] = useState(false);

  useEffect(() => {
    // 1. Initialize shared Yjs document and fields
    const doc = new Y.Doc();
    const codemirrorField = doc.getText('codemirror');
    const notepadField = doc.getText('notepad');
    const outputField = doc.getText('output');

    // 2. Generate local user presence attributes
    const user = getRandomUser();
    setLocalUser(user);

    // 3. Connect to room over Websocket
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:1234';
    console.log(`Connecting to room ${roomId} at ${wsUrl}`);
    const wsProvider = new WebsocketProvider(wsUrl, roomId, doc);

    // Track connection status
    setConnectionStatus(wsProvider.wsconnected ? 'connected' : 'connecting');
    const handleStatusChange = (event: any) => {
      if (event.status === 'connected') {
        setConnectionStatus('connected');
      } else if (event.status === 'disconnected') {
        setConnectionStatus('disconnected');
      } else if (event.status === 'connecting') {
        setConnectionStatus(prev => prev === 'disconnected' ? 'disconnected' : 'connecting');
      }
    };
    wsProvider.on('status', handleStatusChange);

    const handleConnectionError = () => {
      setConnectionStatus('disconnected');
    };
    wsProvider.on('connection-error', handleConnectionError);

    // Set local awareness state
    wsProvider.awareness.setLocalStateField('user', {
      name: user.name,
      color: user.color,
    });

    setYdoc(doc);
    setProvider(wsProvider);
    setCodeText(codemirrorField);
    setNoteText(notepadField);
    setOutputText(outputField);

    // 4. Bind awareness state changes to list collaborators
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
      setPresenceUsers(users);
    };

    wsProvider.awareness.on('change', handleAwarenessChange);
    handleAwarenessChange();

    // 5. Cleanup on unmount
    return () => {
      wsProvider.off('status', handleStatusChange);
      wsProvider.off('connection-error', handleConnectionError);
      wsProvider.awareness.off('change', handleAwarenessChange);
      wsProvider.disconnect();
      wsProvider.destroy();
      doc.destroy();
    };
  }, [roomId]);

  // Listen to remote changes on output Y.Text
  useEffect(() => {
    if (!outputText) return;

    const handleOutputChange = () => {
      try {
        const textVal = outputText.toString();
        if (textVal) {
          setOutputData(JSON.parse(textVal));
          // Auto-expand panel when new output arrives
          setIsOutputOpen(true);
        } else {
          setOutputData(null);
        }
      } catch (err) {
        console.error('Failed to parse output JSON:', err);
      }
    };

    outputText.observe(handleOutputChange);
    handleOutputChange(); // Run initially

    return () => {
      outputText.unobserve(handleOutputChange);
    };
  }, [outputText]);

  const handleRun = async () => {
    if (!codeText || isRunning) return;

    setIsRunning(true);
    setIsOutputOpen(true); // Open the output panel immediately to show a loading/running feedback
    
    try {
      const code = codeText.toString();
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:1234';
      const httpUrl = wsUrl.replace(/^ws/, 'http');

      const response = await fetch(`${httpUrl}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language,
          code,
        }),
      });

      if (!response.ok) {
        throw new Error(`Execution request failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Update Yjs text output
      if (outputText) {
        const newOutput = {
          stdout: result.stdout || '',
          stderr: result.stderr || '',
          runBy: localUser?.name || 'Anonymous',
          language: languages[language]?.name || language,
        };
        
        outputText.doc?.transact(() => {
          outputText.delete(0, outputText.length);
          outputText.insert(0, JSON.stringify(newOutput));
        });
      }
    } catch (err: any) {
      console.error('Error during execution:', err);
      if (outputText) {
        const errOutput = {
          stdout: '',
          stderr: 'Code execution runs in self-hosted/local mode. Clone the repo and run the Piston engine locally to try it — see the README.',
          runBy: localUser?.name || 'Anonymous',
          language: languages[language]?.name || language,
        };
        outputText.doc?.transact(() => {
          outputText.delete(0, outputText.length);
          outputText.insert(0, JSON.stringify(errOutput));
        });
      }
    } finally {
      setIsRunning(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-white font-sans overflow-hidden">
      {/* Header section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50 select-none">
        <div className="flex items-center justify-between md:justify-start gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/')}
              className="text-neutral-400 hover:text-white rounded-lg cursor-pointer"
            >
              <ArrowLeft size={18} />
            </Button>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-anton tracking-wide uppercase text-white flex items-center gap-2">
                <Code2 className="text-[#D2E823]" size={22} />
                <span>code</span>
                <span className="text-[#D2E823]">sync</span>
              </h1>
              <span className="text-xs px-2 py-0.5 rounded border border-neutral-800 bg-neutral-900 text-neutral-450 ml-2 font-mono">
                #{roomId}
              </span>
            </div>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-4 md:gap-6 w-full md:w-auto">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 font-medium">Language:</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageKey)}
                className="text-sm bg-neutral-900 border border-neutral-800 text-neutral-250 rounded-lg px-3 py-1.5 outline-none cursor-pointer focus:border-teal-500/50"
              >
                {Object.entries(languages).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Share Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="h-8 gap-1.5 border-neutral-880 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white rounded-lg cursor-pointer"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-500" />
                  <span className="text-emerald-500 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 size={14} />
                  <span>Share</span>
                </>
              )}
            </Button>

            {/* Console Toggle Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOutputOpen(!isOutputOpen)}
              className={`h-8 gap-1.5 border-neutral-800 rounded-lg cursor-pointer px-3 ${
                isOutputOpen ? 'bg-neutral-800 text-white border-neutral-700' : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-855 hover:text-white'
              }`}
            >
              <Terminal size={14} />
              <span>Console</span>
            </Button>

            {/* Run Button */}
            <Button
              onClick={handleRun}
              disabled={isRunning || language === 'html'}
              className="h-8 gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg cursor-pointer px-4 disabled:opacity-55 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:border disabled:border-neutral-850"
            >
              {isRunning ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-black border-t-transparent animate-spin" />
                  <span>Running...</span>
                </>
              ) : language === 'html' ? (
                <span>HTML (No Run)</span>
              ) : (
                <>
                  <Play size={12} fill="black" />
                  <span>Run</span>
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Connection Status Indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-850 text-[10px] font-bold tracking-wider uppercase">
              <span className="relative flex h-2 w-2">
                {connectionStatus !== 'disconnected' && (
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    connectionStatus === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  connectionStatus === 'connected' ? 'bg-emerald-500' :
                  connectionStatus === 'connecting' ? 'bg-amber-500' : 'bg-rose-500'
                }`}></span>
              </span>
              <span className={
                connectionStatus === 'connected' ? 'text-emerald-500' :
                connectionStatus === 'connecting' ? 'text-amber-500' : 'text-rose-500'
              }>
                {connectionStatus === 'connected' ? 'Connected' :
                 connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
              </span>
            </div>

            {/* Connected Collaborators list */}
            <div className="flex items-center gap-3 border-l border-neutral-900 pl-4 md:pl-6">
              <div className="flex -space-x-2 overflow-hidden">
                {presenceUsers.slice(0, 5).map((user) => (
                  <Avatar
                    key={user.clientId}
                    className="inline-block border-2 border-neutral-950 w-7 h-7"
                  >
                    <AvatarFallback
                      style={{ backgroundColor: user.color }}
                      className="text-[9px] font-bold text-black uppercase"
                    >
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {presenceUsers.length > 5 && (
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-neutral-850 text-[9px] font-bold text-neutral-450 border-2 border-neutral-950">
                    +{presenceUsers.length - 5}
                  </div>
                )}
              </div>
              <span className="text-xs font-semibold text-neutral-450 flex items-center gap-1.5">
                <Users size={14} className="text-teal-400" />
                <span>{presenceUsers.length} active</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Editor & Notepad Split Layout */}
      {ydoc && provider && codeText && noteText && localUser ? (
        <main className="flex flex-col lg:flex-row gap-6 p-6 flex-1 h-[calc(100vh-73px)] overflow-y-auto lg:overflow-hidden bg-neutral-950">
          {/* Code Editor & Collapsible Output (left, ~65% width on desktop) */}
          <div className="w-full lg:w-[65%] h-[600px] lg:h-full flex flex-col gap-6 shrink-0 lg:shrink min-h-0">
            <div className="flex-1 min-h-0">
              <Editor
                roomId={roomId}
                language={language}
                ytext={codeText}
                provider={provider}
                localUser={localUser}
              />
            </div>

            {/* Collapsible Output Panel */}
            {isOutputOpen && (
              <div className="h-[220px] lg:h-[250px] shrink-0">
                <OutputPanel
                  outputData={outputData}
                  onClose={() => setIsOutputOpen(false)}
                />
              </div>
            )}
          </div>

          {/* Notepad (right, ~35% width on desktop) */}
          <div className="w-full lg:w-[35%] h-[300px] lg:h-full flex flex-col shrink-0 lg:shrink">
            <Notepad ytext={noteText} />
          </div>
        </main>
      ) : (
        <div className="flex flex-1 items-center justify-center bg-neutral-950 text-neutral-400 h-[calc(100vh-73px)]">
          <div className="flex flex-col items-center gap-2">
            <span className="w-6 h-6 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
            <span className="text-xs font-semibold uppercase tracking-wider animate-pulse">
              Initializing Collaborative Workspace...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
