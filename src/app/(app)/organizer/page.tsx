'use client';

import { useEffect, useState } from 'react';
import { getCountFromServer } from 'firebase/firestore';
import { GlowCard } from '@/components/ui/GlowCard';
import { questsCollection, teamsCollection, submissionsCollection, usersCollection } from '@/lib/firebase/collections';
import { Users, Map, FileText, Gamepad2 } from 'lucide-react';

interface Stats {
  hackers: number;
  teams: number;
  quests: number;
  submissions: number;
}

export default function OrganizerDashboard() {
  const [stats, setStats] = useState<Stats>({ hackers: 0, teams: 0, quests: 0, submissions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getCountFromServer(usersCollection),
      getCountFromServer(teamsCollection),
      getCountFromServer(questsCollection),
      getCountFromServer(submissionsCollection),
    ])
      .then(([usersSnap, teamsSnap, questsSnap, subsSnap]) => {
        setStats({
          hackers: usersSnap.data().count,
          teams: teamsSnap.data().count,
          quests: questsSnap.data().count,
          submissions: subsSnap.data().count,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-cyan-400 animate-pulse">Loading dashboard...</div>;
  }

  const statCards = [
    { label: 'Hackers', value: stats.hackers, icon: Users, color: 'cyan' as const },
    { label: 'Teams', value: stats.teams, icon: Gamepad2, color: 'green' as const },
    { label: 'Quests', value: stats.quests, icon: Map, color: 'magenta' as const },
    { label: 'Submissions', value: stats.submissions, icon: FileText, color: 'cyan' as const },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Organizer Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <GlowCard key={stat.label} glowColor={stat.color}>
              <div className="flex items-center gap-3 mb-2">
                <Icon size={18} className="text-gray-400" />
                <span className="text-xs uppercase tracking-wider text-gray-500">{stat.label}</span>
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
            </GlowCard>
          );
        })}
      </div>
    </div>
  );
}
