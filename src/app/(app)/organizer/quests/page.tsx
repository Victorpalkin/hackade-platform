'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useQuestAdmin } from '@/lib/hooks/use-quest-admin';
import { ArcadeButton } from '@/components/ui/ArcadeButton';
import { GlowCard } from '@/components/ui/GlowCard';

export default function OrganizerQuestsPage() {
  const { quests, loading, deleteQuest } = useQuestAdmin();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (questId: string) => {
    if (!confirm('Are you sure you want to delete this quest?')) return;
    setDeleting(questId);
    await deleteQuest(questId);
    setDeleting(null);
  };

  if (loading) {
    return <div className="text-cyan-400 animate-pulse">Loading quests...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Quests</h1>
        <Link href="/organizer/quests/new">
          <ArcadeButton variant="green">
            <Plus size={16} className="inline mr-2" />
            New Quest
          </ArcadeButton>
        </Link>
      </div>

      <div className="space-y-4">
        {quests.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No quests yet. Create one to get started.</p>
        ) : (
          quests.map((quest) => (
            <GlowCard key={quest.id} glowColor="cyan" className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">{quest.title}</h3>
                <p className="text-sm text-gray-400">{quest.sponsor} &middot; {quest.difficulty}</p>
                <div className="flex gap-2 mt-2">
                  {quest.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/organizer/quests/${quest.id}/edit`}>
                  <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer">
                    <Edit2 size={16} />
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(quest.id)}
                  disabled={deleting === quest.id}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </GlowCard>
          ))
        )}
      </div>
    </div>
  );
}
