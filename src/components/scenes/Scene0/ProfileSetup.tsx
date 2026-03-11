'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, User, Briefcase, Code, FileText, ArrowRight, X } from 'lucide-react';
import { GlowCard } from '@/components/ui/GlowCard';
import { ArcadeButton } from '@/components/ui/ArcadeButton';
import { HackerProfile } from '@/lib/types';
import { linkedInProfile } from '@/lib/mock-data';

interface ProfileSetupProps {
  onComplete: (profile: HackerProfile) => void;
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [bio, setBio] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importStep, setImportStep] = useState(0);

  const handleImportLinkedIn = useCallback(() => {
    setIsImporting(true);
    setImportStep(1);

    // Animate fields filling in one by one
    setTimeout(() => {
      setName(linkedInProfile.name);
      setImportStep(2);
    }, 600);

    setTimeout(() => {
      setTitle(linkedInProfile.title);
      setImportStep(3);
    }, 1200);

    setTimeout(() => {
      setSkills(linkedInProfile.skills);
      setImportStep(4);
    }, 1800);

    setTimeout(() => {
      setBio(linkedInProfile.bio);
      setImportStep(5);
      setIsImporting(false);
    }, 2400);
  }, []);

  const addSkill = useCallback(() => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
      setSkillInput('');
    }
  }, [skillInput, skills]);

  const removeSkill = useCallback((skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  }, []);

  const handleContinue = () => {
    onComplete({ name, title, skills, bio });
  };

  const isValid = name.trim() && title.trim() && skills.length > 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 grid-bg relative">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold glow-text-cyan mb-2">SET UP YOUR PROFILE</h1>
        <p className="text-gray-400 text-lg">Tell us about yourself so we can find your perfect team</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-lg"
      >
        <GlowCard glowColor="cyan" hover={false} className="mb-6">
          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
                <User size={14} /> Name
              </label>
              <motion.input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/50 transition-colors"
                animate={importStep === 1 ? { borderColor: ['rgba(0,240,255,0.5)', 'rgba(255,255,255,0.1)'] } : {}}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Title / Role */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
                <Briefcase size={14} /> Title / Role
              </label>
              <motion.input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Full-Stack Engineer"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/50 transition-colors"
                animate={importStep === 2 ? { borderColor: ['rgba(0,240,255,0.5)', 'rgba(255,255,255,0.1)'] } : {}}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Skills */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
                <Code size={14} /> Skills & Expertise
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                  placeholder="Add a skill..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/50 transition-colors"
                />
                <button
                  onClick={addSkill}
                  className="px-3 py-2 bg-cyan-500/20 border border-cyan-400/30 rounded-lg text-cyan-400 hover:bg-cyan-500/30 transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
              <AnimatePresence>
                <motion.div
                  className="flex flex-wrap gap-2"
                  animate={importStep === 3 ? { borderColor: ['rgba(0,240,255,0.5)', 'transparent'] } : {}}
                >
                  {skills.map((skill) => (
                    <motion.span
                      key={skill}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/20"
                    >
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="hover:text-white cursor-pointer">
                        <X size={12} />
                      </button>
                    </motion.span>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bio */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
                <FileText size={14} /> Short Bio
              </label>
              <motion.textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="What drives you? What do you love building?"
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/50 transition-colors resize-none"
                animate={importStep === 4 ? { borderColor: ['rgba(0,240,255,0.5)', 'rgba(255,255,255,0.1)'] } : {}}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </GlowCard>

        <div className="flex items-center justify-between">
          <ArcadeButton
            variant="magenta"
            size="sm"
            onClick={handleImportLinkedIn}
            disabled={isImporting}
          >
            <Linkedin size={16} className="inline mr-2" />
            {isImporting ? 'Importing...' : 'Import from LinkedIn'}
          </ArcadeButton>

          <ArcadeButton
            variant="cyan"
            size="md"
            pulse={!!isValid}
            onClick={handleContinue}
            disabled={!isValid}
          >
            Continue <ArrowRight size={16} className="inline ml-2" />
          </ArcadeButton>
        </div>
      </motion.div>
    </div>
  );
}
