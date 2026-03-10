'use client';

import { useState, useCallback, useEffect } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/client';
import { TeamMember, Team } from '../types';
import { useAuth } from './use-auth';
import { teamMembers as mockMembers } from '../mock-data';

export function useTeam(teamId?: string) {
  const { user } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>(
    mockMembers.map((m) => ({ ...m, claimed: false }))
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId) {
      setMembers(mockMembers.map((m) => ({ ...m, claimed: false })));
      setLoading(false);
      return;
    }

    const teamRef = doc(db, 'teams', teamId);
    const unsubscribe = onSnapshot(
      teamRef,
      (snap) => {
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() } as Team;
          setTeam(data);
          setMembers(data.members);
        }
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [teamId]);

  const claimRole = useCallback(
    async (memberId: string, role?: string) => {
      if (!teamId || !user) {
        // Local-only mode
        setMembers((prev) =>
          prev.map((m) => (m.id === memberId ? { ...m, claimed: true } : m))
        );
        return;
      }

      const teamRef = doc(db, 'teams', teamId);
      const updatedMembers = members.map((m) =>
        m.id === memberId
          ? { ...m, claimed: true, uid: user.uid, name: user.displayName || m.name, role: role || m.role }
          : m
      );
      await updateDoc(teamRef, { members: updatedMembers });
    },
    [teamId, user, members]
  );

  const autoFillRemaining = useCallback(() => {
    const unclaimed = members.filter((m) => !m.claimed);
    unclaimed.forEach((member, i) => {
      setTimeout(() => {
        setMembers((prev) =>
          prev.map((m) => (m.id === member.id ? { ...m, claimed: true } : m))
        );
      }, (i + 1) * 500);
    });
  }, [members]);

  return {
    team,
    members,
    claimRole,
    autoFillRemaining,
    allClaimed: members.every((m) => m.claimed),
    loading,
  };
}
