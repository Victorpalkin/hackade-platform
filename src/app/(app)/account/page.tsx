'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Linkedin, Github, Save } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useAuth } from '@/lib/hooks/use-auth';
import { GlowCard } from '@/components/ui/GlowCard';
import { ArcadeButton } from '@/components/ui/ArcadeButton';

export default function AccountPage() {
  const { user, profile } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setBio(profile.bio || '');
      setSkills(profile.skills || []);
      setInterests(profile.interests || []);
    }
  }, [profile]);

  const addSkill = () => {
    const val = skillInput.trim();
    if (val && !skills.includes(val)) {
      setSkills([...skills, val]);
      setSkillInput('');
    }
  };

  const addInterest = () => {
    const val = interestInput.trim();
    if (val && !interests.includes(val)) {
      setInterests([...interests, val]);
      setInterestInput('');
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await updateDoc(doc(db, 'users', user.uid), {
      displayName: displayName.trim(),
      bio: bio.trim(),
      skills,
      interests,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-cyan-400 animate-pulse">Loading...</div>
      </div>
    );
  }

  const inputClass = 'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 transition-colors';

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-3.5rem)] p-8 grid-bg relative">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold glow-text-cyan mb-2">YOUR PROFILE</h1>
        <p className="text-gray-400 text-lg">Manage your hacker identity</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-lg"
      >
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-cyan-400/50">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'Avatar'} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-2xl font-bold">
                {(user.displayName || '?')[0]}
              </div>
            )}
          </div>
        </div>

        {/* Import buttons */}
        <div className="flex gap-3 justify-center mb-6">
          <ArcadeButton variant="cyan" size="sm" disabled onClick={() => {}}>
            <Linkedin size={14} className="inline mr-1.5" />
            Import from LinkedIn
          </ArcadeButton>
          <ArcadeButton variant="cyan" size="sm" disabled onClick={() => {}}>
            <Github size={14} className="inline mr-1.5" />
            Import from GitHub
          </ArcadeButton>
        </div>

        <GlowCard glowColor="cyan" hover={false} className="space-y-5">
          {/* Email (read-only) */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Email</label>
            <input
              type="text"
              value={profile.email}
              disabled
              className={`${inputClass} opacity-50 cursor-not-allowed`}
            />
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className={inputClass}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
              className={inputClass}
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Skills</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="e.g. React, Python, ML"
                className={inputClass}
              />
              <button type="button" onClick={addSkill} className="px-3 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white cursor-pointer">
                <Plus size={16} />
              </button>
            </div>
            <div className="flex gap-1 flex-wrap">
              {skills.map((skill) => (
                <span key={skill} className="text-xs px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-300 flex items-center gap-1">
                  {skill}
                  <button type="button" onClick={() => setSkills(skills.filter((s) => s !== skill))} className="cursor-pointer">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Interests</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                placeholder="e.g. AI, Web3, Climate"
                className={inputClass}
              />
              <button type="button" onClick={addInterest} className="px-3 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white cursor-pointer">
                <Plus size={16} />
              </button>
            </div>
            <div className="flex gap-1 flex-wrap">
              {interests.map((interest) => (
                <span key={interest} className="text-xs px-2 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-300 flex items-center gap-1">
                  {interest}
                  <button type="button" onClick={() => setInterests(interests.filter((i) => i !== interest))} className="cursor-pointer">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Save */}
          <ArcadeButton
            variant="green"
            size="lg"
            className="w-full"
            disabled={saving || !displayName.trim()}
            onClick={handleSave}
          >
            <Save size={16} className="inline mr-2" />
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Profile'}
          </ArcadeButton>
        </GlowCard>
      </motion.div>
    </div>
  );
}
