'use client';

import { useState, useCallback } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Users, Tag } from 'lucide-react';
import { useMatching } from '@/lib/hooks/use-matching';
import type { Project } from '@/lib/types';

interface SwipeCardsProps {
  onMatch: () => void;
  cards?: Project[];
}

export function SwipeCards({ onMatch, cards: cardsProp }: SwipeCardsProps) {
  const matching = cardsProp ? null : useMatching();
  const [localIndex, setLocalIndex] = useState(0);

  const cards = cardsProp ?? matching?.cards ?? [];
  const currentIndex = cardsProp ? localIndex : matching?.currentIndex ?? 0;
  const swipe = useCallback((dir: 'left' | 'right') => {
    if (cardsProp) {
      setLocalIndex((i) => i + 1);
    } else {
      matching?.swipe(dir);
    }
  }, [cardsProp, matching]);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      swipe('right');
      if (currentIndex === 1) {
        setTimeout(onMatch, 400);
      }
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
        <h1 className="text-3xl font-bold glow-text-cyan mb-2">FIND YOUR TEAM</h1>
        <p className="text-gray-400">Swipe right on projects that excite you</p>
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
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-fuchsia-500 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              {card.founder.avatar}
            </div>
            <h2 className="text-xl font-bold text-center mb-2">{card.title}</h2>
            <p className="text-sm text-gray-400 text-center mb-6">{card.description}</p>

            <div className="flex items-center gap-2 mb-3">
              <Users size={14} className="text-cyan-400" />
              <span className="text-xs text-gray-400">Looking for:</span>
              <div className="flex gap-1">
                {card.lookingFor.map((role) => (
                  <span key={role} className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Tag size={14} className="text-fuchsia-400" />
              <div className="flex gap-1">
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
              onClick={() => {
                swipe('left');
              }}
            >
              <ThumbsDown size={20} className="text-red-400" />
            </motion.button>
            <motion.button
              className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                swipe('right');
                if (currentIndex === 1) {
                  setTimeout(onMatch, 400);
                }
              }}
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
