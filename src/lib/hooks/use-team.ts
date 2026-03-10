'use client';

import { useState, useCallback } from 'react';
import { TeamMember } from '../types';
import { teamMembers as mockMembers } from '../mock-data';

export function useTeam() {
  const [members, setMembers] = useState<TeamMember[]>(
    mockMembers.map((m) => ({ ...m, claimed: false }))
  );

  const claimRole = useCallback((memberId: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, claimed: true } : m))
    );
  }, []);

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
    members,
    claimRole,
    autoFillRemaining,
    allClaimed: members.every((m) => m.claimed),
  };
}
