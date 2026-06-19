'use client';

import { useEffect, useRef } from 'react';
import { Terminal, X, TerminalSquare } from 'lucide-react';
import { Button } from './ui/button';

interface OutputData {
  stdout: string;
  stderr: string;
  runBy: string;
  language: string;
}

interface OutputPanelProps {
  outputData: OutputData | null;
  onClose: () => void;
}

export default function OutputPanel({ outputData, onClose }: OutputPanelProps) {
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Automatically scroll to the bottom when new output content is populated
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [outputData]);

  return (
    <div className="flex flex-col h-full border border-neutral-850 rounded-xl overflow-hidden shadow-2xl bg-neutral-900/40 backdrop-blur-md">
      {/* Console Header (Glass Chrome) */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-850 bg-neutral-950/70 text-xs text-neutral-400 font-sans select-none">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-neutral-300">
          <Terminal size={14} className="text-emerald-400" />
          <span>Console Output</span>
        </div>
        
        <div className="flex items-center gap-3">
          {outputData && (
            <span className="text-[10px] text-neutral-500 font-medium font-sans">
              Run by <span className="text-neutral-400 font-semibold">{outputData.runBy}</span> · <span className="text-emerald-400/80 uppercase font-mono text-[9px]">{outputData.language}</span>
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-5 h-5 text-neutral-400 hover:text-white hover:bg-neutral-850 rounded-md cursor-pointer flex items-center justify-center"
          >
            <X size={14} />
          </Button>
        </div>
      </div>

      {/* Terminal Output Display */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 w-full p-4 bg-neutral-950/95 font-mono text-xs overflow-auto selection:bg-emerald-500/20 selection:text-emerald-200 leading-relaxed scrollbar-thin scrollbar-thumb-neutral-800"
      >
        {!outputData ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-500 gap-2 select-none">
            <TerminalSquare size={24} className="text-neutral-600 opacity-60" />
            <span>Console idle. Click "Run" to execute your code.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Standard Output Section */}
            {outputData.stdout && (
              <pre className="whitespace-pre-wrap break-all text-neutral-200 font-mono">
                {outputData.stdout}
              </pre>
            )}

            {/* Standard Error (Stderr) Section */}
            {outputData.stderr && (
              <pre className="whitespace-pre-wrap break-all text-rose-400 bg-rose-950/15 border border-rose-950/30 p-3 rounded-lg font-mono">
                {outputData.stderr}
              </pre>
            )}

            {/* Blank State if completed with no output */}
            {!outputData.stdout && !outputData.stderr && (
              <div className="text-neutral-500 italic select-none">
                Program completed with exit code 0 (no output).
              </div>
            )}
          </div>
        )}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}
