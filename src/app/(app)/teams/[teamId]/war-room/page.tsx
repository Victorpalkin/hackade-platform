'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { MessageSquare, Video, FileCode2, Figma, Key, LayoutDashboard, Menu, X } from 'lucide-react';
import { ProgressChecklist } from '@/components/ui/ProgressChecklist';
import { GlowCard } from '@/components/ui/GlowCard';
import { useProvisioning } from '@/lib/hooks/use-provisioning';
import { useTeam } from '@/lib/hooks/use-team';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

export default function WarRoomPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const router = useRouter();
  const { team, loading: teamLoading } = useTeam(teamId);
  const { items, allComplete, runProvisioning } = useProvisioning(teamId);
  const [showDashboard, setShowDashboard] = useState(false);
  const [questTitle, setQuestTitle] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Fetch quest title
  useEffect(() => {
    if (!team?.questId) return;
    getDoc(doc(db, 'quests', team.questId)).then((snap) => {
      if (snap.exists()) {
        setQuestTitle((snap.data() as { title?: string }).title || team.questId);
      }
    }).catch(() => {});
  }, [team?.questId]);

  const projectTitle = team?.title || 'Your Project';

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] grid-bg">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-16 left-2 z-50 md:hidden w-10 h-10 rounded-lg glass border border-white/10 flex items-center justify-center cursor-pointer"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className={`w-64 glass border-r border-white/10 p-4 flex flex-col fixed md:static inset-y-14 left-0 z-40 transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
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
              onClick={() => {
                // Update team phase to provisioning (complete), then navigate to build
                if (teamId) {
                  const projectRef = doc(db, 'projects', teamId);
                  updateDoc(projectRef, { phase: 'provisioning' }).catch(() => {});
                }
                router.push(`/teams/${teamId}/build`);
              }}
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
          <h1 className="text-2xl font-bold mb-1">{projectTitle}</h1>
          <p className="text-gray-400 text-sm">{team?.questId ? `Quest: ${questTitle || team.questId}` : ''}</p>
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
                <p className="text-cyan-400/60">#team-{teamId?.slice(0, 8)}</p>
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
                <p className="text-fuchsia-400/60">{projectTitle} - Designs</p>
              </div>
            </GlowCard>

            <GlowCard glowColor="yellow">
              <div className="flex items-center gap-3 mb-3">
                <FileCode2 size={18} className="text-yellow-400" />
                <span className="font-medium text-sm">GitHub</span>
              </div>
              <div className="text-xs text-gray-500">
                <p className="mb-1">Starter kit cloned</p>
                <p className="text-yellow-400/60">hackade/{projectTitle.toLowerCase().replace(/\s+/g, '-')}</p>
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
