'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ArrowLeft, Users, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageKey, languages } from '@/lib/languages';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Dynamically import the Editor component with SSR disabled
const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

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
  const [presenceUsers, setPresenceUsers] = useState<PresenceUser[]>([]);

  const handlePresenceChange = (users: PresenceUser[]) => {
    setPresenceUsers(users);
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-white font-sans overflow-hidden">
      {/* Header section */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
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

        {/* Action controls and awareness list */}
        <div className="flex items-center gap-6">
          {/* Language selection dropdown */}
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

          {/* Connected collaborators list */}
          <div className="flex items-center gap-3 border-l border-neutral-900 pl-6">
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
            <span className="text-xs font-semibold text-neutral-450 flex items-center gap-1.5 select-none">
              <Users size={14} className="text-teal-400" />
              <span>{presenceUsers.length} active</span>
            </span>
          </div>
        </div>
      </header>

      {/* Editor workspace */}
      <main className="flex flex-1 p-6 bg-neutral-950 overflow-hidden h-[calc(100vh-73px)]">
        <Editor
          roomId={roomId}
          language={language}
          onPresenceChange={handlePresenceChange}
        />
      </main>
    </div>
  );
}
