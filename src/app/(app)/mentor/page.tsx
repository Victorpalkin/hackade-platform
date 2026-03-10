'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { query, where, orderBy, limit, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { helpRequestsCollection } from '@/lib/firebase/collections';
import { db } from '@/lib/firebase/client';
import { useAuth } from '@/lib/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { GlowCard } from '@/components/ui/GlowCard';
import { ArcadeButton } from '@/components/ui/ArcadeButton';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import type { HelpRequest } from '@/lib/types';

const statusIcons: Record<HelpRequest['status'], React.ReactNode> = {
  pending: <Clock size={16} className="text-yellow-400" />,
  claimed: <AlertTriangle size={16} className="text-cyan-400" />,
  resolved: <CheckCircle size={16} className="text-emerald-400" />,
};

export default function MentorPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && profile?.role !== 'mentor' && profile?.role !== 'organizer') {
      router.replace('/quests');
      return;
    }

    const q = query(
      helpRequestsCollection,
      where('status', 'in', ['pending', 'claimed']),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setRequests(snap.docs.map((d) => d.data()));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsubscribe;
  }, [authLoading, profile, router]);

  const claimRequest = useCallback(async (requestId: string) => {
    if (!user) return;
    const ref = doc(db, 'helpRequests', requestId);
    await updateDoc(ref, { status: 'claimed', mentorId: user.uid });
  }, [user]);

  const resolveRequest = useCallback(async (requestId: string) => {
    const ref = doc(db, 'helpRequests', requestId);
    await updateDoc(ref, { status: 'resolved' });
  }, []);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-cyan-400 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold glow-text-cyan mb-6">Mentor Help Queue</h1>

      {requests.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No help requests. Teams are doing great!</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <GlowCard
              key={req.id}
              glowColor={req.status === 'pending' ? 'magenta' : req.status === 'claimed' ? 'cyan' : 'green'}
              hover={false}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {statusIcons[req.status]}
                    <h3 className="font-bold">{req.teamName}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                      {req.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{req.description}</p>
                  <p className="text-xs text-gray-600 mt-2">
                    {new Date(req.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {req.status === 'pending' && (
                    <ArcadeButton variant="cyan" size="sm" onClick={() => claimRequest(req.id)}>
                      Claim
                    </ArcadeButton>
                  )}
                  {req.status === 'claimed' && req.mentorId === user?.uid && (
                    <ArcadeButton variant="green" size="sm" onClick={() => resolveRequest(req.id)}>
                      Resolve
                    </ArcadeButton>
                  )}
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      )}
    </div>
  );
}
