'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Users, Tag, Sparkles, ArrowRight, Plus } from 'lucide-react';
import { useMatching } from '@/lib/hooks/use-matching';
import { ArcadeButton } from '@/components/ui/ArcadeButton';
import Link from 'next/link';

export default function MatchPage() {
  const { questId } = useParams<{ questId: string }>();
  const router = useRouter();
  const {
    cards, currentIndex, matched, matchedTeamId, swipe, isComplete, loading,
  } = useMatching(questId);
  const [showMatch, setShowMatch] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      handleSwipe('right');
    } else if (info.offset.x < -100) {
      handleSwipe('left');
    }
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    await swipe(direction);
    if (direction === 'right' && matched) {
      setShowMatch(true);
    }
  };

  // After swipe completes, check if we got a match
  if (matched && !showMatch) {
    setShowMatch(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-cyan-400 animate-pulse">Loading projects...</div>
      </div>
    );
  }

  // Match reveal
  if (showMatch && matched) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-fuchsia-500/10 via-transparent to-transparent" />

        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-fuchsia-400 rounded-full"
            initial={{
              x: Math.random() * 1000,
              y: Math.random() * 800,
              opacity: 0,
            }}
            animate={{
              y: [null, Math.random() * -200],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
          className="text-center relative z-10"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <Sparkles size={48} className="text-fuchsia-400 mx-auto" />
          </motion.div>

          <motion.h1
            className="text-6xl font-black mb-4 bg-gradient-to-r from-fuchsia-400 via-cyan-400 to-fuchsia-400 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ['0% center', '200% center'],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{ backgroundSize: '200% auto' }}
          >
            IT&apos;S A MATCH!
          </motion.h1>

          <p className="text-xl text-gray-300 mb-2">
            You matched with <span className="text-cyan-400 font-bold">{matched.title}</span>
          </p>
          <p className="text-gray-500 mb-8">
            {matched.founder.name} wants you on the team
          </p>

          <div className="flex gap-6 justify-center mb-8">
            <motion.div
              className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-2xl font-bold"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Y
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
              className="self-center"
            >
              <Sparkles size={24} className="text-accent-yellow" />
            </motion.div>
            <motion.div
              className="w-20 h-20 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-500 flex items-center justify-center text-2xl font-bold"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {matched.founder.avatar}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <ArcadeButton
              variant="magenta"
              size="lg"
              pulse
              onClick={() => {
                if (matchedTeamId) {
                  router.push(`/teams/${matchedTeamId}`);
                } else {
                  router.push('/quests');
                }
              }}
            >
              Join the Team <ArrowRight size={18} className="inline ml-2" />
            </ArcadeButton>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // No more cards
  if (isComplete || cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] p-8 grid-bg">
        <h2 className="text-2xl font-bold mb-4">No more projects to swipe</h2>
        <p className="text-gray-400 mb-6">Create your own project or check back later!</p>
        <div className="flex gap-4">
          <Link href={`/quests/${questId}/create-project`}>
            <ArcadeButton variant="green">
              <Plus size={16} className="inline mr-2" />
              Create Project
            </ArcadeButton>
          </Link>
          <Link href="/quests">
            <ArcadeButton variant="cyan">Back to Quests</ArcadeButton>
          </Link>
        </div>
      </div>
    );
  }

  const card = cards[currentIndex];
  if (!card) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] p-8 grid-bg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold glow-text-cyan mb-2">FIND YOUR TEAM</h1>
        <p className="text-gray-400">Swipe right on projects that excite you</p>
      </motion.div>

      <div className="relative w-80 h-[420px]">
        {currentIndex < cards.length - 1 && (
          <div className="absolute inset-0 glass rounded-2xl p-6 opacity-40 scale-95 translate-y-3">
            <div className="text-center text-gray-500 mt-20">Next project...</div>
          </div>
        )}

        <motion.div
          key={card.id}
          className="absolute inset-0 glass rounded-2xl p-6 cursor-grab active:cursor-grabbing border border-white/10"
          style={{ x, rotate }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.8}
          onDragEnd={handleDragEnd}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          whileDrag={{ scale: 1.05 }}
        >
          <motion.div
            className="absolute top-6 right-6 text-emerald-400 font-bold text-2xl rotate-12 border-2 border-emerald-400 px-3 py-1 rounded-lg"
            style={{ opacity: likeOpacity }}
          >
            LIKE
          </motion.div>
          <motion.div
            className="absolute top-6 left-6 text-red-400 font-bold text-2xl -rotate-12 border-2 border-red-400 px-3 py-1 rounded-lg"
            style={{ opacity: nopeOpacity }}
          >
            NOPE
          </motion.div>

          <div className="mt-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-fuchsia-500 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              {card.founder.avatar}
            </div>
            <h2 className="text-xl font-bold text-center mb-2">{card.title}</h2>
            <p className="text-sm text-gray-400 text-center mb-6">{card.description}</p>

            <div className="flex items-center gap-2 mb-3">
              <Users size={14} className="text-cyan-400" />
              <span className="text-xs text-gray-400">Looking for:</span>
              <div className="flex gap-1 flex-wrap">
                {card.lookingFor.map((role) => (
                  <span key={role} className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Tag size={14} className="text-fuchsia-400" />
              <div className="flex gap-1 flex-wrap">
                {card.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-fuchsia-500/10 text-fuchsia-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6">
            <motion.button
              className="w-14 h-14 rounded-full bg-red-500/20 border border-red-400/50 flex items-center justify-center cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => swipe('left')}
            >
              <ThumbsDown size={20} className="text-red-400" />
            </motion.button>
            <motion.button
              className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => swipe('right')}
            >
              <ThumbsUp size={20} className="text-emerald-400" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-4 mt-6">
        <p className="text-xs text-gray-600">
          Card {currentIndex + 1} of {cards.length}
        </p>
        <Link
          href={`/quests/${questId}/create-project`}
          className="text-xs text-cyan-400/60 hover:text-cyan-400 transition-colors"
        >
          <Plus size={12} className="inline mr-1" />
          Create your own
        </Link>
      </div>
    </div>
  );
}
