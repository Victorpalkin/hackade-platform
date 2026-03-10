'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Brain, Leaf, Eye, Swords, Plus } from 'lucide-react';
import { GlowCard } from '@/components/ui/GlowCard';
import { ArcadeButton } from '@/components/ui/ArcadeButton';
import { useQuests } from '@/lib/hooks/use-quests';

const iconMap: Record<string, React.ReactNode> = {
  Brain: <Brain size={24} />,
  Leaf: <Leaf size={24} />,
  Eye: <Eye size={24} />,
};

const glowColors: Array<'cyan' | 'green' | 'magenta'> = ['cyan', 'green', 'magenta'];
const colorClasses = [
  'bg-cyan-500/20 text-cyan-400',
  'bg-emerald-500/20 text-emerald-400',
  'bg-fuchsia-500/20 text-fuchsia-400',
];

export default function QuestsPage() {
  const { quests, loading } = useQuests();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-cyan-400 animate-pulse">Loading quests...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] p-8 grid-bg relative">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-bold glow-text-cyan mb-2">CHOOSE YOUR QUEST</h1>
        <p className="text-gray-400 text-lg">Select a sponsor track to begin your adventure</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mb-8">
        {quests.map((quest, i) => {
          const colorIdx = i % glowColors.length;
          return (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <GlowCard
                glowColor={glowColors[colorIdx]}
                hover={true}
                className="cursor-pointer h-full"
                onClick={() => router.push(`/quests/${quest.id}/match`)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${colorClasses[colorIdx]}`}>
                    {iconMap[quest.icon ?? 'Brain']}
                  </div>
                  <span className="text-xs uppercase tracking-wider text-gray-500">{quest.sponsor}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{quest.title}</h3>
                <p className="text-sm text-gray-400 mb-3">{quest.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 flex-wrap">
                    {quest.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {quest.prize && (
                    <span className="text-sm font-bold text-accent-yellow">{quest.prize}</span>
                  )}
                </div>
              </GlowCard>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.6 }}
      >
        <ArcadeButton variant="magenta" size="sm" disabled>
          <Swords size={16} className="inline mr-2" />
          Mercenary Mode (Coming Soon)
        </ArcadeButton>
      </motion.div>
    </div>
  );
}
