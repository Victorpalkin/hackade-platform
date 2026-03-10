'use client';

import { useRouter } from 'next/navigation';
import { useQuestAdmin } from '@/lib/hooks/use-quest-admin';
import { QuestForm } from '@/components/forms/QuestForm';

export default function NewQuestPage() {
  const router = useRouter();
  const { createQuest } = useQuestAdmin();

  return (
    <QuestForm
      heading="Create Quest"
      submitLabel="Create Quest"
      glowColor="green"
      onSubmit={async (data) => {
        await createQuest(data);
        router.push('/organizer/quests');
      }}
    />
  );
}
