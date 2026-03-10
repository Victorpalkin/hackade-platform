'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlowCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  glowColor?: 'cyan' | 'magenta' | 'green' | 'yellow';
  hover?: boolean;
}

const glowMap = {
  cyan: 'hover:shadow-[0_0_25px_rgba(0,240,255,0.3)] border-cyan-500/30',
  magenta: 'hover:shadow-[0_0_25px_rgba(255,0,255,0.3)] border-fuchsia-500/30',
  green: 'hover:shadow-[0_0_25px_rgba(0,255,136,0.3)] border-emerald-500/30',
  yellow: 'hover:shadow-[0_0_25px_rgba(255,221,0,0.3)] border-yellow-500/30',
};

const activeGlowMap = {
  cyan: 'shadow-[0_0_25px_rgba(0,240,255,0.3)]',
  magenta: 'shadow-[0_0_25px_rgba(255,0,255,0.3)]',
  green: 'shadow-[0_0_25px_rgba(0,255,136,0.3)]',
  yellow: 'shadow-[0_0_25px_rgba(255,221,0,0.3)]',
};

export function GlowCard({
  children,
  glowColor = 'cyan',
  hover = true,
  className = '',
  ...props
}: GlowCardProps) {
  return (
    <motion.div
      className={`glass rounded-xl p-5 transition-shadow duration-300 ${glowMap[glowColor]} ${
        !hover ? activeGlowMap[glowColor] : ''
      } ${className}`}
      whileHover={hover ? { scale: 1.02 } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}
