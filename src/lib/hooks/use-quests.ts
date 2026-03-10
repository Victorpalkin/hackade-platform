'use client';

import { useState, useEffect } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { Quest } from '../types';
import { questsCollection } from '../firebase/collections';
import { quests as mockQuests } from '../mock-data';

export function useQuests() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      questsCollection,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => doc.data());
        // Fall back to mock data if Firestore is empty / not configured
        setQuests(data.length > 0 ? data : mockQuests);
        setLoading(false);
      },
      () => {
        // On error (e.g. no Firebase config), use mock data
        setQuests(mockQuests);
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
