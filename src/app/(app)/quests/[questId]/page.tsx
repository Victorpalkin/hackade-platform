'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Leaf, Eye, ArrowRight, Plus, Users } from 'lucide-react';
import { doc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { projectsCollection } from '@/lib/firebase/collections';
import { ArcadeButton } from '@/components/ui/ArcadeButton';
import { GlowCard } from '@/components/ui/GlowCard';
import { quests as mockQuests } from '@/lib/mock-data';
import type { Quest } from '@/lib/types';

const iconMap: Record<string, React.ReactNode> = {
  Brain: <Brain size={32} />,
  Leaf: <Leaf size={32} />,
  Eye: <Eye size={32} />,
};

const difficultyColors: Record<string, string> = {
  beginner: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  intermediate: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  advanced: 'text-red-400 bg-red-500/10 border-red-500/20',
};

export default function QuestDetailPage() {
  const { questId } = useParams<{ questId: string }>();
  const router = useRouter();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!questId) return;

    // Fetch quest data
    getDoc(doc(db, 'quests', questId))
      .then((snap) => {
        if (snap.exists()) {
          setQuest({ id: snap.id, ...snap.data() } as Quest);
        } else {
          // Fall back to mock data
          const mock = mockQuests.find((q) => q.id === questId);
          if (mock) setQuest(mock);
        }
      })
      .catch(() => {
        const mock = mockQuests.find((q) => q.id === questId);
        if (mock) setQuest(mock);
      })
      .finally(() => setLoading(false));

    // Count projects in this quest
    const q = query(projectsCollection, where('questId', '==', questId));
    getDocs(q)
      .then((snap) => setProjectCount(snap.size))
      .catch(() => {});
  }, [questId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-cyan-400 animate-pulse">Loading quest...</div>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <h2 className="text-xl font-bold text-gray-400">Quest not found</h2>
        <ArcadeButton variant="cyan" onClick={() => router.push('/quests')}>
          Back to Quests
        </ArcadeButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] p-8 grid-bg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <GlowCard glowColor="cyan" hover={false} className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400">
              {iconMap[quest.icon ?? 'Brain'] ?? <Brain size={32} />}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">{quest.sponsor}</p>
              <h1 className="text-3xl font-bold">{quest.title}</h1>
            </div>
          </div>

          <p className="text-gray-300 text-lg mb-6">{quest.description}</p>

          <div className="flex flex-wrap gap-3 mb-6">
            <span className={`text-xs px-3 py-1 rounded-full border ${difficultyColors[quest.difficulty]}`}>
              {quest.difficulty}
            </span>
            {quest.tags.map((tag) => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between mb-8">
            {quest.prize && (
              <div className="text-lg font-bold text-accent-yellow">
                Prize: {quest.prize}
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Users size={14} />
              <span>{projectCount} project{projectCount !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <ArcadeButton
              variant="cyan"
              size="lg"
              pulse
              onClick={() => router.push(`/quests/${questId}/match`)}
            >
              Browse Projects <ArrowRight size={18} className="inline ml-2" />
            </ArcadeButton>
            <ArcadeButton
              variant="green"
              size="lg"
              onClick={() => router.push(`/quests/${questId}/create-project`)}
            >
              <Plus size={18} className="inline mr-2" />
              Create Project
            </ArcadeButton>
          </div>
        </GlowCard>
      </motion.div>
    </div>
  );
}
