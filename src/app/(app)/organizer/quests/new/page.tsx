'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuestAdmin } from '@/lib/hooks/use-quest-admin';
import { ArcadeButton } from '@/components/ui/ArcadeButton';
import { GlowCard } from '@/components/ui/GlowCard';
import type { Quest } from '@/lib/types';

export default function NewQuestPage() {
  const router = useRouter();
  const { createQuest } = useQuestAdmin();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    sponsor: '',
    description: '',
    difficulty: 'intermediate' as Quest['difficulty'],
    tags: '',
    prize: '',
    icon: 'Brain',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await createQuest({
      title: form.title,
      sponsor: form.sponsor,
      description: form.description,
      difficulty: form.difficulty,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      prize: form.prize || undefined,
      icon: form.icon || undefined,
    });
    router.push('/organizer/quests');
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Create Quest</h1>
      <GlowCard glowColor="green" hover={false}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-400/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Sponsor</label>
            <input
              type="text"
              required
              value={form.sponsor}
              onChange={(e) => setForm({ ...form, sponsor: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-400/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            <textarea
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-400/50 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value as Quest['difficulty'] })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-400/50 focus:outline-none"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Prize</label>
              <input
                type="text"
                value={form.prize}
                onChange={(e) => setForm({ ...form, prize: e.target.value })}
                placeholder="$5,000"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-400/50 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="AI/ML, Cloud, Web"
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-400/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Icon</label>
            <select
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-400/50 focus:outline-none"
            >
              <option value="Brain">Brain</option>
              <option value="Leaf">Leaf</option>
              <option value="Eye">Eye</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <ArcadeButton variant="green" disabled={saving}>
              {saving ? 'Creating...' : 'Create Quest'}
            </ArcadeButton>
            <ArcadeButton variant="cyan" onClick={() => router.back()}>
              Cancel
            </ArcadeButton>
          </div>
        </form>
      </GlowCard>
    </div>
  );
}
