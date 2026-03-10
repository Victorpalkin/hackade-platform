'use client';

import { useState } from 'react';
import { Quest } from '../types';
import { quests as mockQuests } from '../mock-data';

export function useQuests() {
  const [quests] = useState<Quest[]>(mockQuests);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  return {
    quests,
    selectedQuest,
    selectQuest: (quest: Quest) => setSelectedQuest(quest),
    clearSelection: () => setSelectedQuest(null),
  };
}
