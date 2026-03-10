'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { TopNav } from '@/components/nav/TopNav';
import type { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen">
        <TopNav />
        <main className="flex-1">{children}</main>
      </div>
    </AuthGuard>
  );
}
