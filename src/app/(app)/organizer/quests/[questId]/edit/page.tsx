'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useQuestAdmin } from '@/lib/hooks/use-quest-admin';
import { ArcadeButton } from '@/components/ui/ArcadeButton';
import { GlowCard } from '@/components/ui/GlowCard';
import type { Quest } from '@/lib/types';

export default function EditQuestPage() {
  const { questId } = useParams<{ questId: string }>();
  const router = useRouter();
  const { updateQuest } = useQuestAdmin();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    sponsor: '',
    description: '',
    difficulty: 'intermediate' as Quest['difficulty'],
    tags: '',
    prize: '',
    icon: 'Brain',
  });

  useEffect(() => {
    if (!questId) return;
    getDoc(doc(db, 'quests', questId))
      .then((snap) => {
        if (snap.exists()) {
          const data = snap.data() as Omit<Quest, 'id'>;
          setForm({
            title: data.title,
            sponsor: data.sponsor,
            description: data.description,
            difficulty: data.difficulty,
            tags: data.tags.join(', '),
            prize: data.prize || '',
            icon: data.icon || 'Brain',
          });
        }
      })
      .finally(() => setLoading(false));
  }, [questId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questId) return;
    setSaving(true);
    await updateQuest(questId, {
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

  if (loading) {
    return <div className="text-cyan-400 animate-pulse">Loading quest...</div>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Edit Quest</h1>
      <GlowCard glowColor="cyan" hover={false}>
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
            <ArcadeButton variant="cyan" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </ArcadeButton>
            <ArcadeButton variant="magenta" onClick={() => router.back()}>
              Cancel
            </ArcadeButton>
          </div>
        </form>
      </GlowCard>
    </div>
  );
}
