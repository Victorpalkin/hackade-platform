'use client';

import { useParams, useRouter } from 'next/navigation';
import { SafetyNet } from '@/components/scenes/Scene4/SafetyNet';
import { useTeam } from '@/lib/hooks/use-team';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { addDoc } from 'firebase/firestore';
import { helpRequestsCollection } from '@/lib/firebase/collections';
import { useEffect, useRef, useCallback } from 'react';
import type { HelpRequest } from '@/lib/types';

export default function BuildPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const router = useRouter();
  const { team } = useTeam(teamId);
  const phaseUpdated = useRef(false);

  useEffect(() => {
    if (teamId && team && team.phase === 'provisioning' && !phaseUpdated.current) {
      phaseUpdated.current = true;
      const teamRef = doc(db, 'teams', teamId);
      updateDoc(teamRef, { phase: 'building' }).catch(() => {
        phaseUpdated.current = false;
      });
    }
  }, [teamId, team]);

  const handleContinue = () => {
    router.push(`/teams/${teamId}/submit`);
  };

  const handleEscalate = useCallback(async () => {
    if (!teamId) return;
    const helpRequest: Omit<HelpRequest, 'id'> = {
      teamId,
      teamName: team?.projectTitle || `Team ${teamId.slice(0, 8)}`,
      description: 'Team requested mentor help via Panic Button',
      status: 'pending',
      createdAt: Date.now(),
    };
    await addDoc(helpRequestsCollection, helpRequest);
  }, [teamId, team?.projectTitle]);

  return <SafetyNet onContinue={handleContinue} onEscalate={handleEscalate} />;
}
