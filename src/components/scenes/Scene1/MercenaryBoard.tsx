'use client';

import { useState, useCallback } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Users, Tag, Swords, Zap } from 'lucide-react';
import { mercenaryCards } from '@/lib/mock-data';
import { ProjectCard } from '@/lib/types';

interface MercenaryBoardProps {
  onMatch: () => void;
}

export function MercenaryBoard({ onMatch }: MercenaryBoardProps) {
  const [cards] = useState<ProjectCard[]>(mercenaryCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const swipe = useCallback(
    (direction: 'left' | 'right') => {
      if (direction === 'right' && currentIndex >= 1) {
        // Match on the second right-swipe (index 2 is third card)
        setTimeout(onMatch, 400);
      }
      setTimeout(() => {
        setCurrentIndex((i) => Math.min(i + 1, cards.length - 1));
      }, 300);
    },
    [currentIndex, cards.length, onMatch]
  );

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      swipe('right');
    } else if (info.offset.x < -100) {
      swipe('left');
    }
  };

  const card = cards[currentIndex];
  if (!card) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 grid-bg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <Swords size={28} className="text-fuchsia-400" />
          <h1 className="text-3xl font-bold glow-text-magenta">MERCENARY MODE</h1>
          <Swords size={28} className="text-fuchsia-400" />
        </div>
        <p className="text-gray-400">
          Projects matched to your skills across <span className="text-fuchsia-300">all quests</span>
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Zap size={14} className="text-accent-yellow" />
          <span className="text-xs text-gray-500">Skill-matched from your profile</span>
        </div>
      </motion.div>

      <div className="relative w-80 h-[420px]">
        {/* Next card preview */}
        {currentIndex < cards.length - 1 && (
          <div className="absolute inset-0 glass rounded-2xl p-6 opacity-40 scale-95 translate-y-3">
            <div className="text-center text-gray-500 mt-20">Next project...</div>
          </div>
        )}

        <motion.div
          key={card.id}
          className="absolute inset-0 glass rounded-2xl p-6 cursor-grab active:cursor-grabbing border border-fuchsia-500/20"
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
          {/* LIKE indicator */}
          <motion.div
            className="absolute top-6 right-6 text-emerald-400 font-bold text-2xl rotate-12 border-2 border-emerald-400 px-3 py-1 rounded-lg"
            style={{ opacity: likeOpacity }}
          >
            LIKE
          </motion.div>

          {/* NOPE indicator */}
          <motion.div
            className="absolute top-6 left-6 text-red-400 font-bold text-2xl -rotate-12 border-2 border-red-400 px-3 py-1 rounded-lg"
            style={{ opacity: nopeOpacity }}
          >
            NOPE
          </motion.div>

          <div className="mt-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fuchsia-500 to-amber-500 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              {card.founder.avatar}
            </div>
            <h2 className="text-xl font-bold text-center mb-2">{card.title}</h2>
            <p className="text-sm text-gray-400 text-center mb-6">{card.description}</p>

            <div className="flex items-center gap-2 mb-3">
              <Users size={14} className="text-fuchsia-400" />
              <span className="text-xs text-gray-400">Looking for:</span>
              <div className="flex gap-1 flex-wrap">
                {card.lookingFor.map((role) => (
                  <span key={role} className="text-xs px-2 py-0.5 rounded-full bg-fuchsia-500/10 text-fuchsia-300">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Tag size={14} className="text-cyan-400" />
              <div className="flex gap-1 flex-wrap">
                {card.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300">
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

      <p className="text-xs text-gray-600 mt-6">
        Card {currentIndex + 1} of {cards.length} &middot; Drag or use buttons
      </p>
    </div>
  );
}
