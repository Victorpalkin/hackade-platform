'use client';

import { useState, useEffect, useCallback } from 'react';
import { doc, addDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/client';
import { questsCollection } from '../firebase/collections';
import type { Quest } from '../types';

export function useQuestAdmin() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      questsCollection,
      (snapshot) => {
        setQuests(snapshot.docs.map((d) => d.data()));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsubscribe;
  }, []);

  const createQuest = useCallback(async (data: Omit<Quest, 'id'>) => {
    const ref = await addDoc(questsCollection, data);
    return ref.id;
  }, []);

  const updateQuest = useCallback(async (questId: string, data: Partial<Omit<Quest, 'id'>>) => {
    const ref = doc(db, 'quests', questId);
    await updateDoc(ref, data);
  }, []);

  const deleteQuest = useCallback(async (questId: string) => {
    const ref = doc(db, 'quests', questId);
    await deleteDoc(ref);
  }, []);

  return {
    quests,
    loading,
    createQuest,
    updateQuest,
    deleteQuest,
  };
}
