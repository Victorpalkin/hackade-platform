'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { MessageSquare, Video, FileCode2, Figma, Key, LayoutDashboard, Settings, Users, Bot, ExternalLink } from 'lucide-react';
import { ProgressChecklist } from '@/components/ui/ProgressChecklist';
import { GlowCard } from '@/components/ui/GlowCard';
import { useProvisioning } from '@/lib/hooks/use-provisioning';

interface WarRoomProps {
  onReady: () => void;
}

type MenuItem = 'provisioning' | 'resources' | 'team' | 'ai-tools';

const chatMessages = [
  { name: 'Maya', message: 'Just finished the Figma mockups!', delay: 3000 },
  { name: 'Jordan', message: 'Working on the pitch deck', delay: 7000 },
  { name: 'Maya', message: 'The color scheme is neon arcade vibes', delay: 12000 },
  { name: 'Jordan', message: 'Love it! This is going to be epic', delay: 16000 },
];

export function WarRoom({ onReady }: WarRoomProps) {
  const { items, allComplete, runProvisioning } = useProvisioning();
  const [showDashboard, setShowDashboard] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuItem>('provisioning');
  const [countdown, setCountdown] = useState(4 * 60 + 32);
  const [visibleMessages, setVisibleMessages] = useState<typeof chatMessages>([]);

  useEffect(() => {
    const timer = setTimeout(() => runProvisioning(), 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (allComplete) {
      const timer = setTimeout(() => {
        setShowDashboard(true);
        setActiveMenu('resources');
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [allComplete]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Chat simulation
  useEffect(() => {
    const timers = chatMessages.map((msg, i) =>
      setTimeout(() => {
        setVisibleMessages((prev) => [...prev, chatMessages[i]]);
      }, msg.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const hours = Math.floor(countdown / 60);
  const minutes = countdown % 60;

  const menuItems: { id: MenuItem; label: string; icon: React.ReactNode }[] = [
    { id: 'provisioning', label: 'Provisioning', icon: <Settings size={16} /> },
    { id: 'resources', label: 'Resources', icon: <LayoutDashboard size={16} /> },
    { id: 'team', label: 'Team', icon: <Users size={16} /> },
    { id: 'ai-tools', label: 'AI Tools', icon: <Bot size={16} /> },
  ];

  return (
    <div className="flex min-h-screen grid-bg">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className="w-64 glass border-r border-white/10 p-4 flex flex-col"
      >
        <div className="flex items-center gap-2 mb-2">
          <LayoutDashboard size={20} className="text-cyan-400" />
          <h2 className="font-bold text-lg">War Room</h2>
        </div>

        {/* Countdown */}
        <div className="text-xs text-gray-500 mb-4 px-1">
          <span className="text-cyan-400 font-mono font-bold">{hours}h {minutes.toString().padStart(2, '0')}m</span> remaining
        </div>

        {/* Menu */}
        <nav className="space-y-1 mb-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                activeMenu === item.id
                  ? 'bg-cyan-500/10 text-cyan-300 font-medium'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-300'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Provisioning checklist (always visible in sidebar) */}
        {activeMenu === 'provisioning' && (
          <>
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-3">Status</div>
            <ProgressChecklist items={items} />
          </>
        )}

        {/* Mini chat feed */}
        <div className="mt-auto pt-4 border-t border-white/10">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Team Chat</p>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {visibleMessages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs"
              >
                <span className="text-cyan-400 font-medium">{msg.name}:</span>{' '}
                <span className="text-gray-400">{msg.message}</span>
              </motion.div>
            ))}
            {visibleMessages.length === 0 && (
              <p className="text-xs text-gray-600 italic">No messages yet...</p>
            )}
          </div>
        </div>

        {allComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-4"
          >
            <button
              onClick={onReady}
              className="w-full py-2 rounded-lg bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-sm font-medium hover:bg-cyan-500/30 transition-colors cursor-pointer"
            >
              Continue to Build Phase
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold mb-1">AI-Powered Tamagotchi</h1>
          <p className="text-gray-400 text-sm">Google Finance AI Agents Quest</p>
        </motion.div>

        {showDashboard ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-4"
          >
            <ResourceCard
              icon={<MessageSquare size={18} className="text-cyan-400" />}
              title="Google Chat"
              description="Team chat space created"
              link="#ai-tamagotchi-team"
              linkLabel="#ai-tamagotchi-team"
              glowColor="cyan"
            />
            <ResourceCard
              icon={<Video size={18} className="text-emerald-400" />}
              title="Google Meet"
              description="Meeting link ready"
              link="#meet"
              linkLabel="meet.google.com/abc-defg-hij"
              glowColor="green"
            />
            <ResourceCard
              icon={<Figma size={18} className="text-fuchsia-400" />}
              title="Figma"
              description="Design file shared"
              link="#figma"
              linkLabel="AI Tamagotchi - Designs"
              glowColor="magenta"
            />
            <ResourceCard
              icon={<FileCode2 size={18} className="text-yellow-400" />}
              title="GitHub"
              description="Starter kit cloned"
              link="#github"
              linkLabel="hackade/ai-tamagotchi"
              glowColor="yellow"
            />

            <GlowCard glowColor="cyan" className="col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <Key size={18} className="text-cyan-400" />
                <span className="font-medium text-sm">API Keys</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-2 rounded bg-white/5">
                  <p className="text-gray-500">Gemini API</p>
                  <p className="text-emerald-400 font-mono">AIza...x8Kq</p>
                </div>
                <div className="p-2 rounded bg-white/5">
                  <p className="text-gray-500">Maps API</p>
                  <p className="text-emerald-400 font-mono">AIza...m2Pv</p>
                </div>
                <div className="p-2 rounded bg-white/5">
                  <p className="text-gray-500">Cloud Storage</p>
                  <p className="text-emerald-400 font-mono">gs://hack...</p>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <motion.p
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-gray-500"
            >
              Setting up your workspace...
            </motion.p>
          </div>
        )}
      </div>
    </div>
  );
}

function ResourceCard({
  icon,
  title,
  description,
  link,
  linkLabel,
  glowColor,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  linkLabel: string;
  glowColor: 'cyan' | 'magenta' | 'green' | 'yellow';
}) {
  return (
    <GlowCard glowColor={glowColor}>
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <span className="font-medium text-sm">{title}</span>
      </div>
      <div className="text-xs text-gray-500">
        <p className="mb-1">{description}</p>
        <a
          href={link}
          onClick={(e) => e.preventDefault()}
          className="inline-flex items-center gap-1 hover:underline cursor-pointer"
          style={{ color: glowColor === 'cyan' ? '#67e8f9' : glowColor === 'magenta' ? '#e879f9' : glowColor === 'green' ? '#6ee7b7' : '#fde047' }}
        >
          {linkLabel}
          <ExternalLink size={10} />
        </a>
      </div>
    </GlowCard>
  );
}
