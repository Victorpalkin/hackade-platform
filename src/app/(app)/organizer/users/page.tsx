'use client';

import { useEffect, useState } from 'react';
import { getDocs, doc, updateDoc } from 'firebase/firestore';
import { usersCollection } from '@/lib/firebase/collections';
import { db } from '@/lib/firebase/client';
import { GlowCard } from '@/components/ui/GlowCard';
import type { UserProfile } from '@/lib/types';

const roleOptions: UserProfile['role'][] = ['hacker', 'organizer', 'mentor'];

export default function OrganizerUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(usersCollection)
      .then((snap) => setUsers(snap.docs.map((d) => d.data())))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const changeRole = async (userId: string, newRole: UserProfile['role']) => {
    const ref = doc(db, 'users', userId);
    await updateDoc(ref, { role: newRole });
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  if (loading) {
    return <div className="text-cyan-400 animate-pulse">Loading users...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      {users.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No users found.</p>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <GlowCard key={u.id} glowColor="cyan" className="flex items-center justify-between">
              <div>
                <h3 className="font-bold">{u.displayName || 'Anonymous'}</h3>
                <p className="text-sm text-gray-400">{u.email}</p>
              </div>
              <select
                value={u.role}
                onChange={(e) => changeRole(u.id, e.target.value as UserProfile['role'])}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-400/50 focus:outline-none cursor-pointer"
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </GlowCard>
          ))}
        </div>
      )}
    </div>
  );
}
