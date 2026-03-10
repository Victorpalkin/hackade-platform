'use client';

import { useParams, useRouter } from 'next/navigation';
import { SafetyNet } from '@/components/scenes/Scene4/SafetyNet';
import { useTeam } from '@/lib/hooks/use-team';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useEffect } from 'react';

export default function BuildPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const router = useRouter();
  const { team } = useTeam(teamId);

  useEffect(() => {
    if (teamId && team && team.phase === 'provisioning') {
      const teamRef = doc(db, 'teams', teamId);
      updateDoc(teamRef, { phase: 'building' }).catch(() => {});
    }
  }, [teamId, team]);

  const handleContinue = () => {
    router.push(`/teams/${teamId}/submit`);
  };

  return <SafetyNet onContinue={handleContinue} teamId={teamId} />;
}
