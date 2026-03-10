'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ArcadeButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'cyan' | 'magenta' | 'green' | 'red' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles = {
  cyan: 'bg-cyan-500/20 border-cyan-400 text-cyan-300 hover:bg-cyan-500/30 hover:shadow-[0_0_25px_rgba(0,240,255,0.4)]',
  magenta: 'bg-fuchsia-500/20 border-fuchsia-400 text-fuchsia-300 hover:bg-fuchsia-500/30 hover:shadow-[0_0_25px_rgba(255,0,255,0.4)]',
  green: 'bg-emerald-500/20 border-emerald-400 text-emerald-300 hover:bg-emerald-500/30 hover:shadow-[0_0_25px_rgba(0,255,136,0.4)]',
  red: 'bg-red-500/20 border-red-400 text-red-300 hover:bg-red-500/30 hover:shadow-[0_0_25px_rgba(255,51,85,0.4)]',
  yellow: 'bg-yellow-500/20 border-yellow-400 text-yellow-300 hover:bg-yellow-500/30 hover:shadow-[0_0_25px_rgba(255,221,0,0.4)]',
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export function ArcadeButton({
  children,
  onClick,
  variant = 'cyan',
  size = 'md',
  pulse = false,
  disabled = false,
  className = '',
  type,
}: ArcadeButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-lg border font-bold uppercase tracking-wider
        transition-all duration-200 cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${pulse ? 'arcade-pulse' : ''}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.05 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
    >
      {children}
    </motion.button>
  );
}
