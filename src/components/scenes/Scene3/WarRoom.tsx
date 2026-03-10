'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { MessageSquare, Video, FileCode2, Figma, Key, LayoutDashboard } from 'lucide-react';
import { ProgressChecklist } from '@/components/ui/ProgressChecklist';
import { GlowCard } from '@/components/ui/GlowCard';
import { useProvisioning } from '@/lib/hooks/use-provisioning';

interface WarRoomProps {
  onReady: () => void;
}

export function WarRoom({ onReady }: WarRoomProps) {
  const { items, allComplete, runProvisioning } = useProvisioning();
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => runProvisioning(), 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (allComplete) {
      const timer = setTimeout(() => setShowDashboard(true), 600);
      return () => clearTimeout(timer);
    }
  }, [allComplete]);

  return (
    <div className="flex min-h-screen grid-bg">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className="w-64 glass border-r border-white/10 p-4 flex flex-col"
      >
        <div className="flex items-center gap-2 mb-6">
          <LayoutDashboard size={20} className="text-cyan-400" />
          <h2 className="font-bold text-lg">War Room</h2>
        </div>

        <div className="text-xs uppercase tracking-wider text-gray-500 mb-3">Provisioning</div>
        <ProgressChecklist items={items} />

        {allComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-auto pt-4"
          >
            <button
              onClick={onReady}
              className="w-full py-2 rounded-lg bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-sm font-medium hover:bg-cyan-500/30 transition-colors cursor-pointer"
            >
              Continue to Build Phase
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold mb-1">AI-Powered Tamagotchi</h1>
          <p className="text-gray-400 text-sm">Google Finance AI Agents Quest</p>
        </motion.div>

        {showDashboard ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-4"
          >
            <GlowCard glowColor="cyan">
              <div className="flex items-center gap-3 mb-3">
                <MessageSquare size={18} className="text-cyan-400" />
                <span className="font-medium text-sm">Google Chat</span>
              </div>
              <div className="text-xs text-gray-500">
                <p className="mb-1">Team chat space created</p>
                <p className="text-cyan-400/60">#ai-tamagotchi-team</p>
              </div>
            </GlowCard>

            <GlowCard glowColor="green">
              <div className="flex items-center gap-3 mb-3">
                <Video size={18} className="text-emerald-400" />
                <span className="font-medium text-sm">Google Meet</span>
              </div>
              <div className="text-xs text-gray-500">
                <p className="mb-1">Meeting link ready</p>
                <p className="text-emerald-400/60">meet.google.com/abc-defg-hij</p>
              </div>
            </GlowCard>

            <GlowCard glowColor="magenta">
              <div className="flex items-center gap-3 mb-3">
                <Figma size={18} className="text-fuchsia-400" />
                <span className="font-medium text-sm">Figma</span>
              </div>
              <div className="text-xs text-gray-500">
                <p className="mb-1">Design file shared</p>
                <p className="text-fuchsia-400/60">AI Tamagotchi - Designs</p>
              </div>
            </GlowCard>

            <GlowCard glowColor="yellow">
              <div className="flex items-center gap-3 mb-3">
                <FileCode2 size={18} className="text-yellow-400" />
                <span className="font-medium text-sm">GitHub</span>
              </div>
              <div className="text-xs text-gray-500">
                <p className="mb-1">Starter kit cloned</p>
                <p className="text-yellow-400/60">hackade/ai-tamagotchi</p>
              </div>
            </GlowCard>

            <GlowCard glowColor="cyan" className="col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <Key size={18} className="text-cyan-400" />
                <span className="font-medium text-sm">API Keys</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-2 rounded bg-white/5">
                  <p className="text-gray-500">Gemini API</p>
                  <p className="text-emerald-400 font-mono">AIza...x8Kq</p>
                </div>
                <div className="p-2 rounded bg-white/5">
                  <p className="text-gray-500">Maps API</p>
                  <p className="text-emerald-400 font-mono">AIza...m2Pv</p>
                </div>
                <div className="p-2 rounded bg-white/5">
                  <p className="text-gray-500">Cloud Storage</p>
                  <p className="text-emerald-400 font-mono">gs://hack...</p>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <motion.p
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-gray-500"
            >
              Setting up your workspace...
            </motion.p>
          </div>
        )}
      </div>
    </div>
  );
}
