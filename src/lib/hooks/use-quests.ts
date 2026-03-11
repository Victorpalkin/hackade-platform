'use client';

import { useState, useEffect } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { Quest } from '../types';
import { questsCollection } from '../firebase/collections';

export function useQuests() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      questsCollection,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => doc.data());
        setQuests(data);
        setLoading(false);
      },
      () => {
        setQuests([]);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  return {
    quests,
    loading,
    selectedQuest,
    selectQuest: (quest: Quest) => setSelectedQuest(quest),
    clearSelection: () => setSelectedQuest(null),
  };
}
