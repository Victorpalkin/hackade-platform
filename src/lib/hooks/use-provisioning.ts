'use client';

import { useState, useCallback } from 'react';
import { ProvisioningItem } from '../types';
import { provisioningItems as mockItems } from '../mock-data';

export function useProvisioning() {
  const [items, setItems] = useState<ProvisioningItem[]>(
    mockItems.map((item) => ({ ...item, status: 'pending' as const }))
  );
  const [isRunning, setIsRunning] = useState(false);

  const runProvisioning = useCallback(() => {
    setIsRunning(true);
    items.forEach((item, i) => {
      setTimeout(() => {
        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id ? { ...it, status: 'in-progress' } : it
          )
        );
      }, i * 400);

      setTimeout(() => {
        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id ? { ...it, status: 'complete' } : it
          )
        );
        if (i === items.length - 1) {
          setTimeout(() => setIsRunning(false), 200);
        }
      }, i * 400 + 300);
    });
  }, [items]);

  const allComplete = items.every((item) => item.status === 'complete');

  return {
    items,
    isRunning,
    allComplete,
    runProvisioning,
  };
}
