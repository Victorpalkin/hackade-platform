'use client';

import { useEffect, useState } from 'react';
import { query, where, onSnapshot } from 'firebase/firestore';
import Link from 'next/link';
import { Users, ArrowRight } from 'lucide-react';
import { projectsCollection } from '@/lib/firebase/collections';
import { useAuth } from '@/lib/hooks/use-auth';
import { GlowCard } from '@/components/ui/GlowCard';
import { ArcadeButton } from '@/components/ui/ArcadeButton';
import type { Project } from '@/lib/types';

export default function TeamsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(projectsCollection, where('memberUids', 'array-contains', user.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setProjects(snapshot.docs.map((d) => d.data()));
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-cyan-400 animate-pulse">Loading teams...</div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <Users size={48} className="text-gray-600" />
        <h2 className="text-xl font-bold text-gray-400">No teams yet</h2>
        <p className="text-gray-500 text-sm">Join a quest and swipe on projects to find your team!</p>
        <Link href="/quests">
          <ArcadeButton variant="cyan">Browse Quests</ArcadeButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold glow-text-cyan mb-6">My Teams</h1>
      <div className="space-y-4">
        {projects.map((project) => (
          <Link key={project.id} href={`/teams/${project.id}`}>
            <GlowCard glowColor="cyan" className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">{project.title}</h3>
                <p className="text-sm text-gray-400">
                  {project.members.length} member{project.members.length !== 1 ? 's' : ''}
                  {project.createdBy === user?.uid && (
                    <span className="ml-2 text-xs text-fuchsia-400">(founder)</span>
                  )}
                </p>
              </div>
              <ArrowRight size={18} className="text-cyan-400" />
            </GlowCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
