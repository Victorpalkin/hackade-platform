'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useQuestAdmin } from '@/lib/hooks/use-quest-admin';
import { QuestForm } from '@/components/forms/QuestForm';
import type { Quest } from '@/lib/types';

export default function EditQuestPage() {
  const { questId } = useParams<{ questId: string }>();
  const router = useRouter();
  const { updateQuest } = useQuestAdmin();
  const [initialValues, setInitialValues] = useState<{
    title: string; sponsor: string; description: string;
    difficulty: Quest['difficulty']; tags: string; prize: string; icon: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!questId) return;
    getDoc(doc(db, 'quests', questId))
      .then((snap) => {
        if (snap.exists()) {
          const data = snap.data() as Omit<Quest, 'id'>;
          setInitialValues({
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

  if (loading) {
    return <div className="text-cyan-400 animate-pulse">Loading quest...</div>;
  }

  if (!initialValues) {
    return <div className="text-gray-400">Quest not found.</div>;
  }

  return (
    <QuestForm
      heading="Edit Quest"
      submitLabel="Save Changes"
      glowColor="cyan"
      initialValues={initialValues}
      onSubmit={async (data) => {
        if (!questId) return;
        await updateQuest(questId, data);
        router.push('/organizer/quests');
      }}
    />
  );
}
