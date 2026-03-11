'use client';

import { useState, useCallback, useEffect } from 'react';
import { doc, onSnapshot, runTransaction } from 'firebase/firestore';
import { db } from '../firebase/client';
import { TeamMember, Project } from '../types';
import { useAuth } from './use-auth';
import { teamMembers as mockMembers } from '../mock-data';

export function useTeam(teamId?: string) {
  const { user } = useAuth();
  const [team, setTeam] = useState<Project | null>(null);
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

    const projectRef = doc(db, 'projects', teamId);
    const unsubscribe = onSnapshot(
      projectRef,
      (snap) => {
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() } as Project;
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

      const projectRef = doc(db, 'projects', teamId);
      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(projectRef);
        if (!snap.exists()) throw new Error('Project not found');
        const data = snap.data() as Omit<Project, 'id'>;
        const target = data.members.find((m) => m.id === memberId);
        if (target?.claimed) throw new Error('Role already claimed');

        const updatedMembers = data.members.map((m) =>
          m.id === memberId
            ? { ...m, claimed: true, uid: user.uid, name: user.displayName || m.name, role: role || m.role }
            : m
        );
        const updatedUids = [...new Set(updatedMembers.filter((m) => m.uid).map((m) => m.uid!))];
        transaction.update(projectRef, { members: updatedMembers, memberUids: updatedUids });
      });
    },
    [teamId, user]
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
