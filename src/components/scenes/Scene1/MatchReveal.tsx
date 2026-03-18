'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { ArcadeButton } from '@/components/ui/ArcadeButton';

interface MatchRevealProps {
  onContinue: () => void;
}

export function MatchReveal({ onContinue }: MatchRevealProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-gradient-radial from-fuchsia-500/10 via-transparent to-transparent" />

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-fuchsia-400 rounded-full"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
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
          You matched with <span className="text-cyan-400 font-bold">AI-Powered Tamagotchi</span>
        </p>
        <p className="text-gray-500 mb-8">
          Alice wants you on the team as a <span className="text-fuchsia-400">React Wizard</span>
        </p>

        <div className="flex gap-6 justify-center mb-8">
          <motion.div
            className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-2xl font-bold"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            SK
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
            A
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <ArcadeButton variant="magenta" size="lg" pulse onClick={onContinue}>
            Join the Team <ArrowRight size={18} className="inline ml-2" />
          </ArcadeButton>
        </motion.div>
      </motion.div>
    </div>
  );
}
