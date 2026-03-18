'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Check, ArrowRight } from 'lucide-react';
import { ArcadeButton } from '@/components/ui/ArcadeButton';

interface ProfileImportProps {
  onContinue: () => void;
}

const profileData = {
  name: 'Stanislava Kirova',
  headline: 'Full-Stack Developer',
  skills: ['React', 'TypeScript', 'APIs'],
  bio: 'Passionate builder who loves turning ideas into working products. 3+ years shipping web apps with modern tooling.',
};

type Phase = 'connecting' | 'importing' | 'ready';

export function ProfileImport({ onContinue }: ProfileImportProps) {
  const [phase, setPhase] = useState<Phase>('connecting');
  const [importedFields, setImportedFields] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setPhase('importing'), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase !== 'importing') return;

    const fields = ['name', 'headline', 'skills', 'bio'];
    const timers = fields.map((field, i) =>
      setTimeout(() => {
        setImportedFields((prev) => [...prev, field]);
        if (i === fields.length - 1) {
          setTimeout(() => setPhase('ready'), 600);
        }
      }, 800 * (i + 1))
    );

    return () => timers.forEach(clearTimeout);
  }, [phase]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 grid-bg">
      <AnimatePresence mode="wait">
        {phase === 'connecting' && (
          <motion.div
            key="connecting"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <Linkedin size={64} className="text-[#0A66C2] mx-auto" />
            </motion.div>
            <h1 className="text-3xl font-bold glow-text-cyan mb-4">Connecting to LinkedIn...</h1>
            <motion.div
              className="w-48 h-1 bg-white/10 rounded-full mx-auto overflow-hidden"
            >
              <motion.div
                className="h-full bg-cyan-400 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5 }}
              />
            </motion.div>
          </motion.div>
        )}

        {(phase === 'importing' || phase === 'ready') && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <h1 className="text-3xl font-bold glow-text-cyan mb-6 text-center">Profile Import</h1>

            <div className="glass rounded-2xl p-6 border border-white/10 space-y-4">
              {/* Name */}
              <ProfileField
                label="Name"
                value={profileData.name}
                visible={importedFields.includes('name')}
              />

              {/* Headline */}
              <ProfileField
                label="Title"
                value={profileData.headline}
                visible={importedFields.includes('headline')}
              />

              {/* Skills */}
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Skills</p>
                {importedFields.includes('skills') ? (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-2"
                  >
                    {profileData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-sm px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </motion.div>
                ) : (
                  <div className="h-8 rounded bg-white/5 animate-pulse" />
                )}
              </div>

              {/* Bio */}
              <ProfileField
                label="Bio"
                value={profileData.bio}
                visible={importedFields.includes('bio')}
                multiline
              />
            </div>

            {phase === 'ready' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-6 space-y-4"
              >
                <div className="flex items-center justify-center gap-2 text-emerald-400">
                  <Check size={20} />
                  <span className="font-bold">Profile Ready!</span>
                </div>
                <ArcadeButton variant="cyan" size="lg" pulse onClick={onContinue}>
                  Enter Hackade <ArrowRight size={18} className="inline ml-2" />
                </ArcadeButton>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProfileField({
  label,
  value,
  visible,
  multiline,
}: {
  label: string;
  value: string;
  visible: boolean;
  multiline?: boolean;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">{label}</p>
      {visible ? (
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`text-white ${multiline ? 'text-sm text-gray-300' : 'font-medium'}`}
        >
          {value}
        </motion.p>
      ) : (
        <div className={`rounded bg-white/5 animate-pulse ${multiline ? 'h-12' : 'h-6'}`} />
      )}
    </div>
  );
}
