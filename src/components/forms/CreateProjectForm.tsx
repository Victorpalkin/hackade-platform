'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { ArcadeButton } from '@/components/ui/ArcadeButton';
import { GlowCard } from '@/components/ui/GlowCard';

interface CreateProjectFormProps {
  onSubmit: (data: { title: string; description: string; lookingFor: string[]; tags: string[] }) => Promise<void>;
}

export function CreateProjectForm({ onSubmit }: CreateProjectFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [roleInput, setRoleInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const addRole = () => {
    const val = roleInput.trim();
    if (val && !lookingFor.includes(val)) {
      setLookingFor([...lookingFor, val]);
      setRoleInput('');
    }
  };

  const addTag = () => {
    const val = tagInput.trim();
    if (val && !tags.includes(val)) {
      setTags([...tags, val]);
      setTagInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setSubmitting(true);
    await onSubmit({ title, description, lookingFor, tags });
    setSubmitting(false);
  };

  const inputClass = 'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 transition-colors';

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg"
    >
      <GlowCard glowColor="green" hover={false} className="space-y-5">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Project Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. AI-Powered Tamagotchi"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's your project about?"
            rows={3}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Looking For</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())}
              placeholder="e.g. ML Engineer"
              className={inputClass}
            />
            <button type="button" onClick={addRole} className="px-3 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white cursor-pointer">
              <Plus size={16} />
            </button>
          </div>
          <div className="flex gap-1 flex-wrap">
            {lookingFor.map((role) => (
              <span key={role} className="text-xs px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-300 flex items-center gap-1">
                {role}
                <button type="button" onClick={() => setLookingFor(lookingFor.filter((r) => r !== role))} className="cursor-pointer">
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="e.g. AI/ML"
              className={inputClass}
            />
            <button type="button" onClick={addTag} className="px-3 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white cursor-pointer">
              <Plus size={16} />
            </button>
          </div>
          <div className="flex gap-1 flex-wrap">
            {tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-300 flex items-center gap-1">
                {tag}
                <button type="button" onClick={() => setTags(tags.filter((t) => t !== tag))} className="cursor-pointer">
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <ArcadeButton variant="green" size="lg" className="w-full" disabled={submitting || !title.trim() || !description.trim()}>
          {submitting ? 'Creating...' : 'Create Project'}
        </ArcadeButton>
      </GlowCard>
    </motion.form>
  );
}
