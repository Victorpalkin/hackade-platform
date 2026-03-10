'use client';

import { useEffect, useState } from 'react';
import { getDocs } from 'firebase/firestore';
import { teamsCollection } from '@/lib/firebase/collections';
import { GlowCard } from '@/components/ui/GlowCard';
import { Users } from 'lucide-react';
import type { Team } from '@/lib/types';

const phaseColors: Record<string, string> = {
  forming: 'text-yellow-400 bg-yellow-500/10',
  provisioning: 'text-cyan-400 bg-cyan-500/10',
  building: 'text-emerald-400 bg-emerald-500/10',
  submitted: 'text-fuchsia-400 bg-fuchsia-500/10',
};

export default function OrganizerTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(teamsCollection)
      .then((snap) => setTeams(snap.docs.map((d) => d.data())))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-cyan-400 animate-pulse">Loading teams...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">All Teams</h1>
      {teams.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No teams created yet.</p>
      ) : (
        <div className="space-y-3">
          {teams.map((team) => (
            <GlowCard key={team.id} glowColor="cyan" className="flex items-center justify-between">
              <div>
                <h3 className="font-bold">{team.projectTitle}</h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Users size={12} />
                    {team.members.length} member{team.members.length !== 1 ? 's' : ''}
                  </span>
                  <span>Quest: {team.questId}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  {team.members.map((m) => (
                    <span key={m.id} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                      {m.name} ({m.role})
                    </span>
                  ))}
                </div>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${phaseColors[team.phase] || phaseColors.forming}`}>
                {team.phase || 'forming'}
              </span>
            </GlowCard>
          ))}
        </div>
      )}
    </div>
  );
}
