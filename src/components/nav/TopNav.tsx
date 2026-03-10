'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gamepad2, Map, Users, LayoutDashboard } from 'lucide-react';
import { UserMenu } from '@/components/auth/UserMenu';

const navLinks = [
  { href: '/quests', label: 'Quests', icon: Map },
];

export function TopNav() {
  const pathname = usePathname();

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
        </div>
      </div>

      <UserMenu />
    </nav>
  );
}
