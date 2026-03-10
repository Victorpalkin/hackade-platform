'use client';

import { useState } from 'react';
import { ArcadeButton } from '@/components/ui/ArcadeButton';
import { GlowCard } from '@/components/ui/GlowCard';
import type { Quest } from '@/lib/types';

interface QuestFormValues {
  title: string;
  sponsor: string;
  description: string;
  difficulty: Quest['difficulty'];
  tags: string;
  prize: string;
  icon: string;
}

interface QuestFormProps {
  initialValues?: QuestFormValues;
  onSubmit: (data: Omit<Quest, 'id'>) => Promise<void>;
  submitLabel: string;
  glowColor: 'cyan' | 'green' | 'magenta';
  heading: string;
}

const defaultValues: QuestFormValues = {
  title: '',
  sponsor: '',
  description: '',
  difficulty: 'intermediate',
  tags: '',
  prize: '',
  icon: 'Brain',
};

const inputClass = 'w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-400/50 focus:outline-none';

export function QuestForm({ initialValues, onSubmit, submitLabel, glowColor, heading }: QuestFormProps) {
  const [form, setForm] = useState<QuestFormValues>(initialValues || defaultValues);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit({
      title: form.title,
      sponsor: form.sponsor,
      description: form.description,
      difficulty: form.difficulty,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      prize: form.prize || undefined,
      icon: form.icon || undefined,
    });
    setSaving(false);
  };

  const update = (field: keyof QuestFormValues, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">{heading}</h1>
      <GlowCard glowColor={glowColor} hover={false}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Title</label>
            <input type="text" required value={form.title} onChange={(e) => update('title', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Sponsor</label>
            <input type="text" required value={form.sponsor} onChange={(e) => update('sponsor', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            <textarea required value={form.description} onChange={(e) => update('description', e.target.value)} rows={3} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Difficulty</label>
              <select value={form.difficulty} onChange={(e) => update('difficulty', e.target.value)} className={inputClass}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Prize</label>
              <input type="text" value={form.prize} onChange={(e) => update('prize', e.target.value)} placeholder="$5,000" className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Tags (comma-separated)</label>
            <input type="text" value={form.tags} onChange={(e) => update('tags', e.target.value)} placeholder="AI/ML, Cloud, Web" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Icon</label>
            <select value={form.icon} onChange={(e) => update('icon', e.target.value)} className={inputClass}>
              <option value="Brain">Brain</option>
              <option value="Leaf">Leaf</option>
              <option value="Eye">Eye</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <ArcadeButton variant={glowColor} disabled={saving}>
              {saving ? 'Saving...' : submitLabel}
            </ArcadeButton>
          </div>
        </form>
      </GlowCard>
    </div>
  );
}
