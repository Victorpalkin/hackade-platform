'use client';

import { useAuth } from '@/lib/hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Map, Users, FileText, UserCog } from 'lucide-react';

const sidebarLinks = [
  { href: '/organizer', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/organizer/quests', label: 'Quests', icon: Map },
  { href: '/organizer/teams', label: 'Teams', icon: Users },
  { href: '/organizer/submissions', label: 'Submissions', icon: FileText },
  { href: '/organizer/users', label: 'Users', icon: UserCog },
];

export default function OrganizerLayout({ children }: { children: ReactNode }) {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && profile?.role !== 'organizer') {
      router.replace('/quests');
    }
  }, [loading, profile, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-cyan-400 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (profile?.role !== 'organizer') return null;

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <aside className="w-56 glass border-r border-white/10 p-4 flex flex-col">
        <h2 className="font-bold text-lg mb-6 text-cyan-400">Organizer</h2>
        <nav className="space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-cyan-500/10 text-cyan-300'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
