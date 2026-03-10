'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  query, where, getDocs, addDoc, doc, setDoc, onSnapshot,
} from 'firebase/firestore';
import { ProjectCard, SwipeRecord, Team, Notification } from '../types';
import { projectsCollection, swipesCollection, teamsCollection, notificationsCollection } from '../firebase/collections';
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
  const [error, setError] = useState<string | null>(null);

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
      setError(null);

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
          // MVP: every right-swipe is treated as a match
          setMatched(card);

          // Assign roles from the project's lookingFor array
          const userRole = card.lookingFor[0] || 'Developer';
          const founderRole = card.lookingFor[1] || 'Project Lead';
          const memberUids = [user.uid, card.founder.uid || card.createdBy];

          const teamData: Omit<Team, 'id'> = {
            questId: questId || '',
            projectId: card.id,
            projectTitle: card.title,
            memberUids,
            members: [
              {
                id: user.uid,
                name: user.displayName || 'You',
                role: userRole,
                avatar: user.displayName?.charAt(0).toUpperCase() || 'Y',
                skills: [],
                claimed: false,
                uid: user.uid,
              },
              {
                id: card.founder.uid || card.createdBy,
                name: card.founder.name,
                role: founderRole,
                avatar: card.founder.avatar,
                skills: [],
                claimed: false,
                uid: card.founder.uid || card.createdBy,
              },
            ],
            provisioningStatus: {},
            phase: 'forming',
            createdAt: Date.now(),
          };
          const teamRef = await addDoc(teamsCollection, teamData);
          setMatchedTeamId(teamRef.id);

          // Notify the project founder about the match
          const founderId = card.founder.uid || card.createdBy;
          if (founderId && founderId !== user.uid) {
            const notification: Omit<Notification, 'id'> = {
              userId: founderId,
              type: 'match',
              message: `${user.displayName || 'Someone'} matched with your project "${card.title}"`,
              link: `/teams/${teamRef.id}`,
              read: false,
              createdAt: Date.now(),
            };
            await addDoc(notificationsCollection, notification).catch(() => {});
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to record swipe. Please try again.');
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
    error,
  };
}
