'use client';

import { AuthProvider } from '@/lib/hooks/use-auth';
import type { ReactNode } from 'react';

export function AuthProviderWrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
