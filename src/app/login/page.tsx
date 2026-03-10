'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';
import { ArcadeButton } from '@/components/ui/ArcadeButton';
import { useAuth } from '@/lib/hooks/use-auth';

export default function LoginPage() {
  const { user, loading, signIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/quests');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-cyan-400 animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 grid-bg">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10, delay: 0.2 }}
          className="mb-8"
        >
          <Gamepad2 size={64} className="text-cyan-400 mx-auto" />
        </motion.div>

        <h1 className="text-5xl font-black glow-text-cyan mb-4">HACKADE</h1>
        <p className="text-gray-400 text-lg mb-10">The Gamified Hackathon Platform</p>

        <ArcadeButton variant="cyan" size="lg" pulse onClick={signIn}>
          Sign in with Google
        </ArcadeButton>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1 }}
          className="text-xs text-gray-600 mt-6"
        >
          Sign in to browse quests, build teams, and ship projects
        </motion.p>
      </motion.div>
    </div>
  );
}
