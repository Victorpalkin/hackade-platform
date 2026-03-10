'use client';

import { useEffect, useState, useCallback } from 'react';
import { getDocs, addDoc, query, where } from 'firebase/firestore';
import { submissionsCollection, judgmentsCollection } from '@/lib/firebase/collections';
import { GlowCard } from '@/components/ui/GlowCard';
import { ArcadeButton } from '@/components/ui/ArcadeButton';
import { Globe, Video, Star } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import type { Submission, Judgment } from '@/lib/types';

export default function OrganizerSubmissionsPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [judgments, setJudgments] = useState<Record<string, Judgment>>({});
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState<string | null>(null);
  const [scoreInput, setScoreInput] = useState(0);
  const [notesInput, setNotesInput] = useState('');

  useEffect(() => {
    Promise.all([
      getDocs(submissionsCollection),
      getDocs(judgmentsCollection),
    ])
      .then(([subsSnap, judgeSnap]) => {
        setSubmissions(subsSnap.docs.map((d) => d.data()));
        const jMap: Record<string, Judgment> = {};
        judgeSnap.docs.forEach((d) => {
          const j = d.data();
          jMap[j.submissionId] = j;
        });
        setJudgments(jMap);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleScore = useCallback(async (submissionId: string) => {
    if (!user) return;
    const judgment: Omit<Judgment, 'id'> = {
      submissionId,
      judgerId: user.uid,
      score: scoreInput,
      notes: notesInput,
      createdAt: Date.now(),
    };
    await addDoc(judgmentsCollection, judgment);
    setJudgments((prev) => ({ ...prev, [submissionId]: { id: '', ...judgment } }));
    setScoring(null);
    setScoreInput(0);
    setNotesInput('');
  }, [user, scoreInput, notesInput]);

  if (loading) {
    return <div className="text-cyan-400 animate-pulse">Loading submissions...</div>;
  }

  const sorted = [...submissions].sort((a, b) => {
    const scoreA = judgments[a.id || '']?.score || 0;
    const scoreB = judgments[b.id || '']?.score || 0;
    return scoreB - scoreA;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Submissions & Judging</h1>
      {sorted.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No submissions yet.</p>
      ) : (
        <div className="space-y-4">
          {sorted.map((sub, i) => {
            const j = judgments[sub.id || ''];
            return (
              <GlowCard key={sub.id || i} glowColor="cyan" hover={false}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{sub.projectName}</h3>
                    {sub.description && (
                      <p className="text-sm text-gray-400 mt-1">{sub.description}</p>
                    )}
                    <div className="flex gap-4 mt-3 text-sm">
                      <span className="flex items-center gap-1 text-cyan-400">
                        <Globe size={12} />
                        {sub.url}
                      </span>
                      <span className="flex items-center gap-1 text-fuchsia-400">
                        <Video size={12} />
                        Pitch video
                      </span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {sub.teamMembers.map((m) => (
                        <span key={m} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                          {m}
                        </span>
                      ))}
                    </div>
                    {sub.submittedAt && (
                      <p className="text-xs text-gray-600 mt-2">
                        Submitted: {new Date(sub.submittedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {j ? (
                      <div className="flex items-center gap-1 text-accent-yellow">
                        <Star size={16} />
                        <span className="text-lg font-bold">{j.score}/5</span>
                      </div>
                    ) : (
                      <ArcadeButton
                        variant="yellow"
                        size="sm"
                        onClick={() => { setScoring(sub.id || ''); setScoreInput(3); }}
                      >
                        Score
                      </ArcadeButton>
                    )}
                  </div>
                </div>

                {scoring === (sub.id || '') && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-4 mb-3">
                      <label className="text-sm text-gray-400">Score (1-5):</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            onClick={() => setScoreInput(n)}
                            className={`w-8 h-8 rounded flex items-center justify-center cursor-pointer ${
                              n <= scoreInput ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-gray-500'
                            }`}
                          >
                            <Star size={14} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                      placeholder="Judge notes (optional)"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-400/50 focus:outline-none mb-3"
                    />
                    <div className="flex gap-2">
                      <ArcadeButton variant="yellow" size="sm" onClick={() => handleScore(sub.id || '')}>
                        Submit Score
                      </ArcadeButton>
                      <ArcadeButton variant="cyan" size="sm" onClick={() => setScoring(null)}>
                        Cancel
                      </ArcadeButton>
                    </div>
                  </div>
                )}
              </GlowCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
