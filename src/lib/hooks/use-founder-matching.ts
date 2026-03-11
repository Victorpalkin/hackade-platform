'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  query, where, getDocs, doc, setDoc, onSnapshot, updateDoc, arrayUnion, addDoc, collection,
} from 'firebase/firestore';
import { Project, SwipeRecord, UserProfile, Notification } from '../types';
import { projectsCollection, swipesCollection, usersCollection } from '../firebase/collections';
import { db } from '../firebase/client';
import { useAuth } from './use-auth';

export function useFounderMatching(questId?: string) {
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [hackers, setHackers] = useState<UserProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matched, setMatched] = useState<UserProfile | null>(null);
  const [interestSent, setInterestSent] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load founder's project for this quest
  useEffect(() => {
    if (!questId || !user) {
      setLoading(false);
      return;
    }

    const q = query(projectsCollection, where('questId', '==', questId), where('createdBy', '==', user.uid));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const projects = snapshot.docs.map((d) => d.data());
      if (projects.length === 0) {
        setProject(null);
        setLoading(false);
        return;
      }
      const proj = projects[0];
      setProject(proj);

      // Load all users, excluding self and existing members
      const usersSnap = await getDocs(usersCollection);
      const allUsers = usersSnap.docs.map((d) => d.data());
      const existingMemberUids = new Set(proj.memberUids || []);

      // Get already-swiped hackers by this founder for this project
      const founderSwipesQ = query(
        swipesCollection,
        where('swiperId', '==', user.uid),
        where('projectId', '==', proj.id)
      );
      const founderSwipesSnap = await getDocs(founderSwipesQ);
      const swipedTargetUids = new Set(
        founderSwipesSnap.docs
          .filter((d) => d.data().targetUid)
          .map((d) => d.data().targetUid!)
      );

      const filtered = allUsers.filter(
        (u) => u.uid !== user.uid && !existingMemberUids.has(u.uid) && !swipedTargetUids.has(u.uid)
      );
      setHackers(filtered);
      setLoading(false);
    }, () => {
      setLoading(false);
    });
    return unsubscribe;
  }, [questId, user]);

  const swipe = useCallback(
    async (direction: 'left' | 'right') => {
      const hacker = hackers[currentIndex];
      if (!hacker || !user || !project) return;

      setSwipeDirection(direction);
      setError(null);
      setInterestSent(false);

      try {
        // Record founder→hacker swipe with targetUid
        await setDoc(doc(db, 'swipes', `${user.uid}_${project.id}_${hacker.uid}`), {
          swiperId: user.uid,
          projectId: project.id,
          targetUid: hacker.uid,
          direction,
          timestamp: Date.now(),
        } satisfies Omit<SwipeRecord, 'id'>);

        if (direction === 'right') {
          // Check if hacker already swiped right on this project
          const hackerSwipeQ = query(
            swipesCollection,
            where('swiperId', '==', hacker.uid),
            where('projectId', '==', project.id),
            where('direction', '==', 'right')
          );
          const hackerSwipeSnap = await getDocs(hackerSwipeQ);
          // Filter for hacker→project swipes (no targetUid)
          const hackerRightSwipe = hackerSwipeSnap.docs.find((d) => !d.data().targetUid);

          if (hackerRightSwipe) {
            // MATCH! Add hacker to project
            const projectRef = doc(db, 'projects', project.id);
            const newMember = {
              id: hacker.uid,
              name: hacker.displayName || 'Anonymous',
              role: project.lookingFor[0] || 'Developer',
              avatar: hacker.displayName?.charAt(0).toUpperCase() || 'A',
              skills: [],
              claimed: false,
              uid: hacker.uid,
            };
            await updateDoc(projectRef, {
              members: arrayUnion(newMember),
              memberUids: arrayUnion(hacker.uid),
            });

            setMatched(hacker);

            // Notify hacker
            await addDoc(collection(db, 'notifications'), {
              userId: hacker.uid,
              type: 'match',
              message: `You matched with project "${project.title}"! You've been added to the team.`,
              link: `/teams/${project.id}`,
              read: false,
              createdAt: Date.now(),
            } satisfies Omit<Notification, 'id'>).catch(() => {});

            // Notify founder
            await addDoc(collection(db, 'notifications'), {
              userId: user.uid,
              type: 'match',
              message: `${hacker.displayName || 'Someone'} matched with your project "${project.title}"!`,
              link: `/teams/${project.id}`,
              read: false,
              createdAt: Date.now(),
            } satisfies Omit<Notification, 'id'>).catch(() => {});
          } else {
            setInterestSent(true);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to record swipe. Please try again.');
      }

      setTimeout(() => {
        setCurrentIndex((i) => Math.min(i + 1, hackers.length));
        setSwipeDirection(null);
        setInterestSent(false);
        setMatched(null);
      }, direction === 'right' ? 1500 : 300);
    },
    [hackers, currentIndex, user, project]
  );

  return {
    project,
    hackers,
    currentIndex,
    currentHacker: hackers[currentIndex] ?? null,
    matched,
    interestSent,
    swipeDirection,
    swipe,
    clearMatch: () => setMatched(null),
    isComplete: currentIndex >= hackers.length,
    loading,
    error,
  };
}
