'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  query, where, getDocs, addDoc, doc, setDoc, serverTimestamp, onSnapshot,
} from 'firebase/firestore';
import { ProjectCard, SwipeRecord, Team } from '../types';
import { projectsCollection, swipesCollection, teamsCollection } from '../firebase/collections';
import { db } from '../firebase/client';
import { useAuth } from './use-auth';
import { projectCards as mockCards } from '../mock-data';

export function useMatching(questId?: string) {
  const { user } = useAuth();
  const [cards, setCards] = useState<ProjectCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matched, setMatched] = useState<ProjectCard | null>(null);
  const [matchedTeamId, setMatchedTeamId] = useState<string | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!questId || !user) {
      setCards(mockCards);
      setLoading(false);
      return;
    }

    const q = query(projectsCollection, where('questId', '==', questId));
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const allProjects = snapshot.docs.map((d) => d.data());
        // Filter out user's own projects and already-swiped projects
        const swipesQ = query(swipesCollection, where('swiperId', '==', user.uid));
        const swipesSnap = await getDocs(swipesQ);
        const swipedIds = new Set(swipesSnap.docs.map((d) => d.data().projectId));

        const filtered = allProjects.filter(
          (p) => p.createdBy !== user.uid && !swipedIds.has(p.id)
        );
        setCards(filtered);
        setLoading(false);
      },
      () => {
        setCards(mockCards);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [questId, user]);

  const swipe = useCallback(
    async (direction: 'left' | 'right') => {
      const card = cards[currentIndex];
      if (!card || !user) return;

      setSwipeDirection(direction);

      // Record the swipe in Firestore
      const swipeKey = [user.uid, card.createdBy].sort().join('_');
      try {
        await setDoc(doc(db, 'swipes', `${swipeKey}_${card.id}`), {
          swiperId: user.uid,
          projectId: card.id,
          direction,
          timestamp: Date.now(),
        } satisfies Omit<SwipeRecord, 'id'>);

        if (direction === 'right') {
          // Check for mutual match: did the project creator swipe right on any of our projects?
          const reverseSwipesQ = query(
            swipesCollection,
            where('swiperId', '==', card.createdBy),
            where('direction', '==', 'right')
          );
          const reverseSnap = await getDocs(reverseSwipesQ);
          const theySwipedOnOurs = reverseSnap.docs.some(
            (d) => d.data().swiperId === card.createdBy
          );

          // For MVP, any right-swipe is treated as a match (simpler UX)
          if (true || theySwipedOnOurs) {
            setMatched(card);
            // Create a team
            const teamData: Omit<Team, 'id'> = {
              questId: questId || '',
              projectId: card.id,
              projectTitle: card.title,
              members: [
                {
                  id: user.uid,
                  name: user.displayName || 'You',
                  role: '',
                  avatar: user.photoURL?.charAt(0) || 'Y',
                  skills: [],
                  claimed: false,
                  uid: user.uid,
                },
                {
                  id: card.founder.uid || card.createdBy,
                  name: card.founder.name,
                  role: '',
                  avatar: card.founder.avatar,
                  skills: [],
                  claimed: false,
                  uid: card.founder.uid || card.createdBy,
                },
              ],
              provisioningStatus: {},
              createdAt: Date.now(),
            };
            const teamRef = await addDoc(teamsCollection, teamData);
            setMatchedTeamId(teamRef.id);
          }
        }
      } catch {
        // Silently handle errors for now
      }

      setTimeout(() => {
        setCurrentIndex((i) => Math.min(i + 1, cards.length));
        setSwipeDirection(null);
      }, 300);
    },
    [cards, currentIndex, user, questId]
  );

  const createProject = useCallback(
    async (data: { title: string; description: string; lookingFor: string[]; tags: string[] }) => {
      if (!user || !questId) return null;
      const projectData: Omit<ProjectCard, 'id'> = {
        ...data,
        founder: {
          name: user.displayName || 'Anonymous',
          avatar: user.displayName?.charAt(0) || 'A',
          uid: user.uid,
        },
        questId,
        createdBy: user.uid,
      };
      const ref = await addDoc(projectsCollection, projectData);
      return ref.id;
    },
    [user, questId]
  );

  return {
    cards,
    currentIndex,
    currentCard: cards[currentIndex] ?? null,
    matched,
    matchedTeamId,
    swipeDirection,
    swipe,
    createProject,
    clearMatch: () => setMatched(null),
    isComplete: currentIndex >= cards.length,
    loading,
  };
}
