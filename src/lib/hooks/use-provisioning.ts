'use client';

import { useState, useCallback, useEffect } from 'react';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/client';
import { ProvisioningItem } from '../types';
import { provisioningItems as mockItems } from '../mock-data';

export function useProvisioning(teamId?: string) {
  const [items, setItems] = useState<ProvisioningItem[]>(
    mockItems.map((item) => ({ ...item, status: 'pending' as const }))
  );
  const [isRunning, setIsRunning] = useState(false);

  // Load persisted status from team document
  useEffect(() => {
    if (!teamId) return;

    const teamRef = doc(db, 'teams', teamId);
    const unsubscribe = onSnapshot(teamRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const persisted = data.provisioningStatus as Record<string, 'pending' | 'in-progress' | 'complete'> | undefined;
        if (persisted) {
          setItems((prev) =>
            prev.map((item) => ({
              ...item,
              status: persisted[item.id] || item.status,
            }))
          );
        }
      }
    });
    return unsubscribe;
  }, [teamId]);

  const runProvisioning = useCallback(() => {
    setIsRunning(true);

    setItems((currentItems) => {
      const pendingItems = currentItems.filter((item) => item.status !== 'complete');

      pendingItems.forEach((item, i) => {
        setTimeout(() => {
          setItems((prev) =>
            prev.map((it) =>
              it.id === item.id && it.status === 'pending' ? { ...it, status: 'in-progress' } : it
            )
          );
        }, i * 400);

        setTimeout(() => {
          setItems((prev) => {
            const updated = prev.map((it) =>
              it.id === item.id ? { ...it, status: 'complete' as const } : it
            );

            // Persist to Firestore
            if (teamId) {
              const statusMap: Record<string, string> = {};
              updated.forEach((it) => { statusMap[it.id] = it.status; });
              const teamRef = doc(db, 'teams', teamId);
              updateDoc(teamRef, { provisioningStatus: statusMap }).catch(() => {});
            }

            return updated;
          });
          if (i === pendingItems.length - 1) {
            setTimeout(() => setIsRunning(false), 200);
          }
        }, i * 400 + 300);
      });

      if (pendingItems.length === 0) {
        setIsRunning(false);
      }

      return currentItems;
    });
  }, [teamId]);

  const allComplete = items.every((item) => item.status === 'complete');

  return {
    items,
    isRunning,
    allComplete,
    runProvisioning,
  };
}
