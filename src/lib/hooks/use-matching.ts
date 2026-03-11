'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  query, where, getDocs, addDoc, doc, setDoc, onSnapshot, updateDoc, arrayUnion, collection,
} from 'firebase/firestore';
import { Project, SwipeRecord, Notification } from '../types';
import { projectsCollection, swipesCollection } from '../firebase/collections';
import { db } from '../firebase/client';
import { useAuth } from './use-auth';

export function useMatching(questId?: string) {
  const { user } = useAuth();
  const [cards, setCards] = useState<Project[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matched, setMatched] = useState<Project | null>(null);
  const [matchedProjectId, setMatchedProjectId] = useState<string | null>(null);
  const [interestSent, setInterestSent] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!questId || !user) {
      setCards([]);
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
        const swipedIds = new Set(
          swipesSnap.docs
            .filter((d) => !d.data().targetUid) // only hacker→project swipes
            .map((d) => d.data().projectId)
        );

        const filtered = allProjects.filter(
          (p) => p.createdBy !== user.uid && !swipedIds.has(p.id)
        );
        setCards(filtered);
        setLoading(false);
      },
      () => {
        setCards([]);
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
      setInterestSent(false);

      try {
        // Record the swipe
        await setDoc(doc(db, 'swipes', `${user.uid}_${card.id}`), {
          swiperId: user.uid,
          projectId: card.id,
          direction,
          timestamp: Date.now(),
        } satisfies Omit<SwipeRecord, 'id'>);

        if (direction === 'right') {
          // Check if founder already swiped right on this hacker
          const founderSwipeQ = query(
            swipesCollection,
            where('swiperId', '==', card.createdBy),
            where('targetUid', '==', user.uid),
            where('projectId', '==', card.id),
            where('direction', '==', 'right')
          );
          const founderSwipeSnap = await getDocs(founderSwipeQ);

          if (!founderSwipeSnap.empty) {
            // MATCH! Add hacker to project
            const projectRef = doc(db, 'projects', card.id);
            const newMember = {
              id: user.uid,
              name: user.displayName || 'Anonymous',
              role: card.lookingFor[0] || 'Developer',
              avatar: user.displayName?.charAt(0).toUpperCase() || 'A',
              skills: [],
              claimed: false,
              uid: user.uid,
            };
            await updateDoc(projectRef, {
              members: arrayUnion(newMember),
              memberUids: arrayUnion(user.uid),
            });

            setMatched(card);
            setMatchedProjectId(card.id);

            // Notify both parties
            const founderId = card.founder.uid || card.createdBy;
            if (founderId !== user.uid) {
              await addDoc(collection(db, 'notifications'), {
                userId: founderId,
                type: 'match',
                message: `${user.displayName || 'Someone'} matched with your project "${card.title}"!`,
                link: `/teams/${card.id}`,
                read: false,
                createdAt: Date.now(),
              } satisfies Omit<Notification, 'id'>).catch(() => {});
            }
            await addDoc(collection(db, 'notifications'), {
              userId: user.uid,
              type: 'match',
              message: `You matched with project "${card.title}"!`,
              link: `/teams/${card.id}`,
              read: false,
              createdAt: Date.now(),
            } satisfies Omit<Notification, 'id'>).catch(() => {});
          } else {
            // No mutual match yet — notify founder of interest
            setInterestSent(true);
            const founderId = card.founder.uid || card.createdBy;
            if (founderId !== user.uid) {
              await addDoc(collection(db, 'notifications'), {
                userId: founderId,
                type: 'team_joined',
                message: `${user.displayName || 'Someone'} is interested in your project "${card.title}"`,
                link: `/quests/${card.questId}/founder-match`,
                read: false,
                createdAt: Date.now(),
              } satisfies Omit<Notification, 'id'>).catch(() => {});
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to record swipe. Please try again.');
      }

      setTimeout(() => {
        setCurrentIndex((i) => Math.min(i + 1, cards.length));
        setSwipeDirection(null);
        setInterestSent(false);
      }, direction === 'right' ? 1500 : 300);
    },
    [cards, currentIndex, user, questId]
  );

  const createProject = useCallback(
    async (data: { title: string; description: string; lookingFor: string[]; tags: string[] }) => {
      if (!user || !questId) return null;
      const founderMember = {
        id: user.uid,
        name: user.displayName || 'Anonymous',
        role: 'Project Lead',
        avatar: user.displayName?.charAt(0) || 'A',
        skills: [],
        claimed: true,
        uid: user.uid,
      };
      const projectData: Omit<Project, 'id'> = {
        ...data,
        founder: {
          name: user.displayName || 'Anonymous',
          avatar: user.displayName?.charAt(0) || 'A',
          uid: user.uid,
        },
        questId,
        createdBy: user.uid,
        members: [founderMember],
        memberUids: [user.uid],
        phase: 'forming',
        provisioningStatus: {},
        createdAt: Date.now(),
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
    matchedProjectId,
    interestSent,
    swipeDirection,
    swipe,
    createProject,
    clearMatch: () => setMatched(null),
    isComplete: currentIndex >= cards.length,
    loading,
    error,
  };
}
