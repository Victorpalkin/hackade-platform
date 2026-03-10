'use client';

import { motion } from 'framer-motion';
import { Code2, Palette, Presentation, ArrowRight, Check } from 'lucide-react';
import { ArcadeButton } from '@/components/ui/ArcadeButton';
import { GlowCard } from '@/components/ui/GlowCard';
import { useTeam } from '@/lib/hooks/use-team';

const roleIcons: Record<string, React.ReactNode> = {
  'API Whisperer': <Code2 size={32} />,
  'The Pixel Pusher': <Palette size={32} />,
  'The Demo God': <Presentation size={32} />,
};

const roleColors: Record<string, 'cyan' | 'magenta' | 'green'> = {
  'API Whisperer': 'cyan',
  'The Pixel Pusher': 'magenta',
  'The Demo God': 'green',
};

interface CharacterSelectProps {
  onReady: () => void;
}

export function CharacterSelect({ onReady }: CharacterSelectProps) {
  const { members, claimRole, autoFillRemaining, allClaimed } = useTeam();

  const handleClaim = (memberId: string) => {
    claimRole(memberId);
    setTimeout(() => {
      autoFillRemaining();
    }, 600);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 grid-bg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-bold glow-text-magenta mb-2">SELECT YOUR CHARACTER</h1>
        <p className="text-gray-400 text-lg">Choose your role in the team</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full mb-10">
        {members.map((member, i) => {
          const color = roleColors[member.role] ?? 'cyan';
          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <GlowCard
                glowColor={color}
                hover={!member.claimed}
                className={`text-center cursor-pointer relative overflow-hidden ${
                  member.claimed ? 'ring-1 ring-current' : ''
                }`}
                onClick={() => !member.claimed && i === 0 && handleClaim(member.id)}
              >
                {member.claimed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  </motion.div>
                )}

                <motion.div
                  className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                    member.claimed
                      ? 'bg-gradient-to-br from-cyan-500 to-fuchsia-500'
                      : 'bg-white/10 border-2 border-dashed border-white/20'
                  }`}
                  animate={member.claimed ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {member.claimed ? (
                    <span className="text-2xl font-bold">{member.avatar}</span>
                  ) : (
                    <span className="text-gray-500">
                      {roleIcons[member.role]}
                    </span>
                  )}
                </motion.div>

                <h3 className="font-bold text-lg mb-1">
                  {member.claimed ? member.name : '???'}
                </h3>
                <p className={`text-sm font-medium mb-3 ${
                  color === 'cyan' ? 'text-cyan-400' : color === 'magenta' ? 'text-fuchsia-400' : 'text-emerald-400'
                }`}>
                  {member.role}
                </p>

                <div className="flex flex-wrap gap-1 justify-center">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {!member.claimed && i === 0 && (
                  <motion.div
                    className="mt-4"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-xs text-cyan-400 uppercase tracking-wider">
                      Click to Claim
                    </span>
                  </motion.div>
                )}
              </GlowCard>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: allClaimed ? 1 : 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <ArcadeButton
          variant="green"
          size="lg"
          pulse={allClaimed}
          disabled={!allClaimed}
          onClick={onReady}
        >
          Enter the War Room <ArrowRight size={18} className="inline ml-2" />
        </ArcadeButton>
      </motion.div>
    </div>
  );
}
