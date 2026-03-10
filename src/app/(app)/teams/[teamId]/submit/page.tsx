'use client';

import { useParams } from 'next/navigation';
import { DeployFlow } from '@/components/scenes/Scene5/DeployFlow';
import { useTeam } from '@/lib/hooks/use-team';
import type { Submission } from '@/lib/types';

export default function SubmitPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const { team } = useTeam(teamId);

  const submission: Submission | undefined = team
    ? {
        projectName: team.projectTitle,
        url: `https://${team.projectTitle.toLowerCase().replace(/\s+/g, '-')}.hackade.dev`,
        videoUrl: `https://pitch.hackade.dev/rec_${teamId?.slice(0, 8)}`,
        tracks: [],
        description: '',
        teamMembers: team.members.map((m) => `${m.name} (${m.role})`),
      }
    : undefined;

  return <DeployFlow submission={submission} />;
}
