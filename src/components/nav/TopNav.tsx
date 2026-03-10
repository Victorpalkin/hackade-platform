'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Gamepad2, Map, Users, Bell, Shield } from 'lucide-react';
import { UserMenu } from '@/components/auth/UserMenu';
import { useNotifications } from '@/lib/hooks/use-notifications';
import { useAuth } from '@/lib/hooks/use-auth';

const navLinks = [
  { href: '/quests', label: 'Quests', icon: Map },
  { href: '/teams', label: 'My Teams', icon: Users },
];

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  const closeBell = useCallback(() => setBellOpen(false), []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        closeBell();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [closeBell]);

  return (
    <nav className="h-14 glass border-b border-white/10 px-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-6">
        <Link href="/quests" className="flex items-center gap-2 text-cyan-400 font-bold text-lg">
          <Gamepad2 size={22} />
          <span className="hidden sm:inline">Hackade</span>
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-cyan-500/10 text-cyan-300'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={14} />
                {link.label}
              </Link>
            );
          })}
          {(profile?.role === 'organizer') && (
            <Link
              href="/organizer"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                pathname.startsWith('/organizer')
                  ? 'bg-cyan-500/10 text-cyan-300'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Shield size={14} />
              Organizer
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div ref={bellRef} className="relative">
          <button
            onClick={() => setBellOpen(!bellOpen)}
            className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={18} className="text-gray-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-fuchsia-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {bellOpen && (
            <div className="absolute right-0 top-12 w-80 glass rounded-lg border border-white/10 py-2 z-50 max-h-96 overflow-y-auto">
              <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
                <p className="text-sm font-medium">Notifications</p>
                {unreadCount > 0 && (
                  <span className="text-xs text-gray-500">{unreadCount} unread</span>
                )}
              </div>
              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-sm text-gray-500 text-center">No notifications yet</p>
              ) : (
                notifications.slice(0, 20).map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      markAsRead(n.id);
                      closeBell();
                      router.push(n.link);
                    }}
                    className={`w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition-colors cursor-pointer ${
                      n.read ? 'text-gray-500' : 'text-gray-200'
                    }`}
                  >
                    <p className="mb-1">{n.message}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                    {!n.read && (
                      <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 ml-1" />
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <UserMenu />
      </div>
    </nav>
  );
}
