'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Bot, User, Sparkles } from 'lucide-react';
import { ArcadeButton } from '@/components/ui/ArcadeButton';
import { Modal } from '@/components/ui/Modal';
import { TypingEffect } from '@/components/ui/TypingEffect';
import { Terminal } from '@/components/ui/Terminal';
import { GlowCard } from '@/components/ui/GlowCard';
import { vibeCodingLines } from '@/lib/mock-data';

interface SafetyNetProps {
  onContinue: () => void;
  onEscalate?: () => Promise<void>;
}

export function SafetyNet({ onContinue, onEscalate }: SafetyNetProps) {
  const [showPanic, setShowPanic] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [aiTypingDone, setAiTypingDone] = useState(false);
  const [terminalDone, setTerminalDone] = useState(false);
  const [escalated, setEscalated] = useState(false);

  const handleEscalate = async () => {
    if (!onEscalate) return;
    await onEscalate();
    setEscalated(true);
    setShowPanic(false);
  };

  return (
    <div className="flex min-h-screen grid-bg">
      {/* Sidebar */}
      <div className="w-64 glass border-r border-white/10 p-4">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-cyan-400" />
          Build Phase
        </h2>
        <div className="space-y-2 text-sm text-gray-400">
          <div className="p-2 rounded bg-white/5">Team Chat</div>
          <div className="p-2 rounded bg-white/5">Figma</div>
          <div className="p-2 rounded bg-white/5">GitHub</div>
          <div className="p-2 rounded bg-cyan-500/10 text-cyan-300 font-medium">AI Tools</div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Safety Net & AI Tools</h1>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Panic Button */}
          <GlowCard glowColor="cyan">
            <h3 className="font-bold mb-3 text-sm uppercase tracking-wider text-gray-400">
              Panic Button
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Stuck? Hit the panic button for instant AI-powered help from Gemini.
            </p>
            <ArcadeButton
              variant="red"
              pulse
              onClick={() => setShowPanic(true)}
              className="w-full"
            >
              <AlertTriangle size={16} className="inline mr-2" />
              PANIC!
            </ArcadeButton>
          </GlowCard>

          {/* Vibe Coding */}
          <GlowCard glowColor="green">
            <h3 className="font-bold mb-3 text-sm uppercase tracking-wider text-gray-400">
              Vibe Coding
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Let Gemini scaffold code for you. Just describe what you want.
            </p>
            <ArcadeButton
              variant="green"
              onClick={() => setShowTerminal(true)}
              className="w-full"
              disabled={showTerminal}
            >
              <Bot size={16} className="inline mr-2" />
              Start Vibe Coding
            </ArcadeButton>
          </GlowCard>
        </div>

        {/* Terminal */}
        {showTerminal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Terminal
              lines={vibeCodingLines}
              speed={35}
              title="gemini-cli"
              onComplete={() => setTerminalDone(true)}
            />
          </motion.div>
        )}

        {terminalDone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-end"
          >
            <ArcadeButton variant="cyan" onClick={onContinue}>
              Ship It! &rarr;
            </ArcadeButton>
          </motion.div>
        )}

        {/* Panic Modal */}
        <Modal isOpen={showPanic} onClose={() => setShowPanic(false)} title="Gemini AI Assistant">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-blue-400" />
              </div>
              <div className="glass rounded-lg p-3 text-sm">
                <TypingEffect
                  text="I've analyzed your project structure. It looks like your API integration is missing error handling for the Gemini response parser. Here's what I suggest: wrap the fetchPetState() call in a try-catch and add a retry mechanism with exponential backoff. Want me to generate the code?"
                  speed={20}
                  onComplete={() => setAiTypingDone(true)}
                />
              </div>
            </div>

            {aiTypingDone && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 justify-end"
              >
                <ArcadeButton variant="cyan" size="sm">
                  Generate Fix
                </ArcadeButton>
                <ArcadeButton variant="yellow" size="sm" onClick={handleEscalate} disabled={escalated || !onEscalate}>
                  <User size={14} className="inline mr-1" />
                  {escalated ? 'Mentor Notified!' : 'Escalate to Mentor'}
                </ArcadeButton>
              </motion.div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
}
