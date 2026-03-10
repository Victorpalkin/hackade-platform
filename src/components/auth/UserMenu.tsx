'use client';

import { useState, useRef, useEffect } from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';

export function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full overflow-hidden border border-white/20 hover:border-cyan-400/50 transition-colors cursor-pointer"
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-cyan-500/20 flex items-center justify-center">
            <User size={16} className="text-cyan-400" />
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-56 glass rounded-lg border border-white/10 py-2 z-50">
          <div className="px-4 py-2 border-b border-white/10">
            <p className="text-sm font-medium truncate">{user.displayName}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <button
            onClick={() => { setOpen(false); signOut(); }}
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
