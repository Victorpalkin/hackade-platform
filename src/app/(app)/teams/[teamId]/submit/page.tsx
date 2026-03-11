'use client';

import { useParams } from 'next/navigation';
import { DeployFlow } from '@/components/scenes/Scene5/DeployFlow';
import { useTeam } from '@/lib/hooks/use-team';
import { useAuth } from '@/lib/hooks/use-auth';
import { addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { submissionsCollection } from '@/lib/firebase/collections';
import type { Submission } from '@/lib/types';
import { useCallback } from 'react';

export default function SubmitPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const { team } = useTeam(teamId);
  const { user } = useAuth();

  const submission: Submission | undefined = team
    ? {
        projectName: team.title,
        url: `https://${team.title.toLowerCase().replace(/\s+/g, '-')}.hackade.dev`,
        videoUrl: `https://pitch.hackade.dev/rec_${teamId?.slice(0, 8)}`,
        tracks: [],
        description: '',
        teamMembers: team.members.map((m) => `${m.name} (${m.role})`),
      }
    : undefined;

  const handleSubmit = useCallback(async (data: Submission) => {
    if (!teamId || !user) return;
    const submissionData: Omit<Submission, 'id'> = {
      ...data,
      teamId,
      submittedAt: Date.now(),
      submittedBy: user.uid,
    };
    await addDoc(submissionsCollection, submissionData).catch(() => {});

    // Update project phase to submitted
    const projectRef = doc(db, 'projects', teamId);
    await updateDoc(projectRef, { phase: 'submitted' }).catch(() => {});
  }, [teamId, user]);

  return <DeployFlow submission={submission} onSubmit={handleSubmit} />;
}
