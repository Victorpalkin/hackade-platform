'use client';

import { useParams, useRouter } from 'next/navigation';
import { CreateProjectForm } from '@/components/forms/CreateProjectForm';
import { useMatching } from '@/lib/hooks/use-matching';
import { motion } from 'framer-motion';

export default function CreateProjectPage() {
  const { questId } = useParams<{ questId: string }>();
  const router = useRouter();
  const { createProject } = useMatching(questId);

  const handleSubmit = async (data: { title: string; description: string; lookingFor: string[]; tags: string[] }) => {
    await createProject(data);
    router.push(`/quests/${questId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] p-8 grid-bg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold glow-text-green mb-2">CREATE YOUR PROJECT</h1>
        <p className="text-gray-400">Pitch your idea and find teammates</p>
      </motion.div>

      <CreateProjectForm onSubmit={handleSubmit} />
    </div>
  );
}
