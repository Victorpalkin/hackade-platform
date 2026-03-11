'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Sparkles, ArrowRight, AlertTriangle, Send, Mail, User } from 'lucide-react';
import { useFounderMatching } from '@/lib/hooks/use-founder-matching';
import { ArcadeButton } from '@/components/ui/ArcadeButton';
import Link from 'next/link';

export default function FounderMatchPage() {
  const { questId } = useParams<{ questId: string }>();
  const router = useRouter();
  const {
    project, hackers, currentIndex, currentHacker, matched, interestSent,
    swipe, isComplete, loading, error,
  } = useFounderMatching(questId);
  const [showMatch, setShowMatch] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      swipe('right');
    } else if (info.offset.x < -100) {
      swipe('left');
    }
  };

  useEffect(() => {
    if (matched && !showMatch) setShowMatch(true);
    if (!matched) setShowMatch(false);
  }, [matched, showMatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-cyan-400 animate-pulse">Loading hackers...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <h2 className="text-xl font-bold text-gray-400">No project found in this quest</h2>
        <p className="text-gray-500 text-sm">Create a project first to start finding teammates.</p>
        <Link href={`/quests/${questId}/create-project`}>
          <ArcadeButton variant="green">Create Project</ArcadeButton>
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <AlertTriangle size={32} className="text-red-400" />
        <p className="text-red-400">{error}</p>
        <ArcadeButton variant="cyan" onClick={() => window.location.reload()}>
          Try Again
        </ArcadeButton>
      </div>
    );
  }

  // Match reveal
  if (showMatch && matched) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-fuchsia-500/10 via-transparent to-transparent" />

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
            animate={{ backgroundPosition: ['0% center', '200% center'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{ backgroundSize: '200% auto' }}
          >
            IT&apos;S A MATCH!
          </motion.h1>

          <p className="text-xl text-gray-300 mb-2">
            <span className="text-cyan-400 font-bold">{matched.displayName}</span> has been added to your team!
          </p>
          <p className="text-gray-500 mb-8">
            They expressed interest in {project.title}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <ArcadeButton
              variant="magenta"
              size="lg"
              pulse
              onClick={() => router.push(`/teams/${project.id}`)}
            >
              View Team <ArrowRight size={18} className="inline ml-2" />
            </ArcadeButton>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // No more hackers
  if (isComplete || hackers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] p-8 grid-bg">
        <h2 className="text-2xl font-bold mb-4">No more hackers to review</h2>
        <p className="text-gray-400 mb-6">Check back later as more people join!</p>
        <div className="flex gap-4">
          <Link href={`/teams/${project.id}`}>
            <ArcadeButton variant="cyan">View My Team</ArcadeButton>
          </Link>
          <Link href={`/quests/${questId}`}>
            <ArcadeButton variant="green">Back to Quest</ArcadeButton>
          </Link>
        </div>
      </div>
    );
  }

  const hacker = currentHacker;
  if (!hacker) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] p-8 grid-bg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold glow-text-magenta mb-2">FIND TEAMMATES</h1>
        <p className="text-gray-400">Swipe right on hackers you want on <span className="text-cyan-400">{project.title}</span></p>
      </motion.div>

      {interestSent && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-20 z-50 px-6 py-3 rounded-xl bg-fuchsia-500/20 border border-fuchsia-400/50 text-fuchsia-300 flex items-center gap-2"
        >
          <Send size={16} />
          Interest recorded! They&apos;ll be notified when they swipe on your project.
        </motion.div>
      )}

      <div className="relative w-80 h-[420px]">
        {currentIndex < hackers.length - 1 && (
          <div className="absolute inset-0 glass rounded-2xl p-6 opacity-40 scale-95 translate-y-3">
            <div className="text-center text-gray-500 mt-20">Next hacker...</div>
          </div>
        )}

        <motion.div
          key={hacker.uid}
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

          <div className="mt-12 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-500 flex items-center justify-center text-3xl font-bold mx-auto mb-6">
              {hacker.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={hacker.photoURL} alt={hacker.displayName} className="w-full h-full rounded-full object-cover" />
              ) : (
                hacker.displayName?.charAt(0).toUpperCase() || '?'
              )}
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">{hacker.displayName}</h2>

            <div className="flex items-center gap-2 text-gray-400 mb-4">
              <Mail size={14} />
              <span className="text-sm">{hacker.email}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-400">
              <User size={14} />
              <span className="text-sm capitalize">{hacker.role}</span>
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
          Hacker {currentIndex + 1} of {hackers.length}
        </p>
      </div>
    </div>
  );
}
