'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface TerminalProps {
  lines: string[];
  speed?: number;
  onComplete?: () => void;
  title?: string;
}

export function Terminal({ lines, speed = 40, onComplete, title = 'terminal' }: TerminalProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentLine >= lines.length) {
      onComplete?.();
      return;
    }

    const line = lines[currentLine];

    if (currentChar >= line.length) {
      setDisplayedLines((prev) => [...prev, line]);
      setCurrentLine((l) => l + 1);
      setCurrentChar(0);
      return;
    }

    const isCode = currentLine > 4;
    const timeout = setTimeout(() => {
      setCurrentChar((c) => c + 1);
    }, isCode ? speed / 3 : speed);

    return () => clearTimeout(timeout);
  }, [currentLine, currentChar, lines, speed, onComplete]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedLines, currentChar]);

  const currentText =
    currentLine < lines.length ? lines[currentLine].slice(0, currentChar) : '';

  return (
    <motion.div
      className="rounded-xl overflow-hidden border border-white/10 bg-[#0d1117]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/10">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-xs text-gray-500 font-mono">{title}</span>
      </div>
      <div
        ref={containerRef}
        className="p-4 font-mono text-sm max-h-80 overflow-y-auto"
        style={{ fontFamily: 'var(--font-jetbrains, monospace)' }}
      >
        {displayedLines.map((line, i) => (
          <div key={i} className={line.startsWith('$') ? 'text-emerald-400' : 'text-gray-300'}>
            {line || '\u00A0'}
          </div>
        ))}
        {currentLine < lines.length && (
          <div className={currentText.startsWith('$') ? 'text-emerald-400' : 'text-gray-300'}>
            {currentText}
            <span className="animate-pulse text-cyan-400">|</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
