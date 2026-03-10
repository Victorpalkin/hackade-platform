'use client';

import { useState, useCallback } from 'react';
import { ProjectCard } from '../types';
import { projectCards as mockCards } from '../mock-data';

export function useMatching() {
  const [cards] = useState<ProjectCard[]>(mockCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matched, setMatched] = useState<ProjectCard | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const swipe = useCallback(
    (direction: 'left' | 'right') => {
      setSwipeDirection(direction);
      if (direction === 'right') {
        setMatched(cards[currentIndex]);
      }
      setTimeout(() => {
        setCurrentIndex((i) => Math.min(i + 1, cards.length - 1));
        setSwipeDirection(null);
      }, 300);
    },
    [cards, currentIndex]
  );

  const triggerMatch = useCallback(() => {
    setMatched(cards[cards.length - 1]);
  }, [cards]);

  return {
    cards,
    currentIndex,
    currentCard: cards[currentIndex] ?? null,
    matched,
    swipeDirection,
    swipe,
    triggerMatch,
    clearMatch: () => setMatched(null),
    isComplete: currentIndex >= cards.length,
  };
}
