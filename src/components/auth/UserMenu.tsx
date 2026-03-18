'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';

export function UserMenu() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => setOpen(false), []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        closeMenu();
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeMenu();
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeMenu]);

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="User menu"
        aria-expanded={open}
        className="w-9 h-9 rounded-full overflow-hidden border border-white/20 hover:border-cyan-400/50 transition-colors cursor-pointer"
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt={user.displayName || 'User avatar'} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-cyan-500/20 flex items-center justify-center">
            <User size={16} className="text-cyan-400" />
          </div>
        )}
      </button>

      {open && (
        <div role="menu" className="absolute right-0 top-12 w-56 glass rounded-lg border border-white/10 py-2 z-50">
          <div className="px-4 py-2 border-b border-white/10">
            <p className="text-sm font-medium truncate">{user.displayName}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <button
            role="menuitem"
            onClick={() => { closeMenu(); router.push('/account'); }}
            className="w-full px-4 py-2 text-sm text-left text-gray-400 hover:text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer"
          >
            <User size={14} />
            Account
          </button>
          <button
            role="menuitem"
            onClick={() => { closeMenu(); signOut(); }}
            className="w-full px-4 py-2 text-sm text-left text-gray-400 hover:text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
