'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Bot, User, Sparkles, Rocket, Send, Check, Cloud, X } from 'lucide-react';
import { ArcadeButton } from '@/components/ui/ArcadeButton';
import { Modal } from '@/components/ui/Modal';
import { TypingEffect } from '@/components/ui/TypingEffect';
import { Terminal } from '@/components/ui/Terminal';
import { GlowCard } from '@/components/ui/GlowCard';
import { vibeCodingLines } from '@/lib/mock-data';

interface SafetyNetProps {
  onContinue: () => void;
  onEscalate?: () => Promise<void>;
}

const gitPushLines = [
  '$ git add .',
  '$ git commit -m "feat: add dark-mode dashboard"',
  '[main abc1234] feat: add dark-mode dashboard',
  ' 3 files changed, 87 insertions(+)',
  '$ git push origin main',
  'Enumerating objects: 8, done.',
  'Counting objects: 100% (8/8), done.',
  'Writing objects: 100% (5/5), 2.1 KiB | 2.1 MiB/s, done.',
  'To github.com:hackade/ai-tamagotchi.git',
  '   e4f5g6h..abc1234  main -> main',
  '',
  'Pushed to main successfully!',
];

const buildDeployLines = [
  '$ npm run build',
  '',
  'Compiling...',
  'Creating an optimized production build...',
  'Route (app)               Size     First Load JS',
  '+ /                       5.2 kB   89.1 kB',
  '+ /dashboard              3.8 kB   87.7 kB',
  '+ /pet                    4.1 kB   88.0 kB',
  '',
  'Build successful (12.3s)',
  '',
  '$ gcloud run deploy ai-tamagotchi --region us-central1',
  '',
  'Deploying container to Cloud Run...',
  'Setting IAM Policy...OK',
  'Creating Revision...done',
  '',
  'Service [ai-tamagotchi] deployed to https://ai-tamagotchi.hackade.dev',
];

type VibeCodingPhase = 'prompt' | 'generating' | 'review' | 'pushing' | 'pushed';
type BuildPhase = 'idle' | 'building' | 'done';

const progressSteps = [
  { label: 'Formed Team', done: true },
  { label: 'Building', done: true },
  { label: 'Ship', done: false },
];

export function SafetyNet({ onContinue }: SafetyNetProps) {
  const [showPanic, setShowPanic] = useState(false);
  const [panicInput, setPanicInput] = useState(
    'My Gemini API calls are returning 429 rate limit errors and I can\'t test my pet evolution feature'
  );
  const [panicSubmitted, setPanicSubmitted] = useState(false);
  const [aiTypingDone, setAiTypingDone] = useState(false);
  const [escalated, setEscalated] = useState(false);

  // Vibe coding state
  const [vibePhase, setVibePhase] = useState<VibeCodingPhase>('prompt');
  const [vibePrompt, setVibePrompt] = useState('add a dark-mode user dashboard');

  // Build & deploy state
  const [buildPhase, setBuildPhase] = useState<BuildPhase>('idle');

  // Mentor notification toast
  const [showMentorToast, setShowMentorToast] = useState(false);

  // Progress tracking
  const [steps, setSteps] = useState(progressSteps);

  // Show mentor toast on mount
  useEffect(() => {
    const timer = setTimeout(() => setShowMentorToast(true), 1500);
    const dismiss = setTimeout(() => setShowMentorToast(false), 6000);
    return () => { clearTimeout(timer); clearTimeout(dismiss); };
  }, []);

  const handleVibeSubmit = () => {
    if (!vibePrompt.trim()) return;
    setVibePhase('generating');
  };

  const handleVibeAccept = () => {
    setVibePhase('pushing');
  };

  const handleVibeReject = () => {
    setVibePhase('prompt');
  };

  const handleEscalate = () => {
    setEscalated(true);
  };

  const handleShipIt = () => {
    setSteps((prev) => prev.map((s) => ({ ...s, done: true })));
    onContinue();
  };

  return (
    <div className="flex min-h-screen grid-bg">
      {/* Mentor toast notification */}
      <AnimatePresence>
        {showMentorToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-4 left-1/2 z-50 glass rounded-lg px-4 py-3 border border-cyan-500/30 flex items-center gap-3"
          >
            <User size={16} className="text-cyan-400" />
            <span className="text-sm text-gray-300">
              <span className="text-cyan-400 font-medium">Mentor Alex</span> is available for your track
            </span>
            <button onClick={() => setShowMentorToast(false)} className="text-gray-500 hover:text-white cursor-pointer">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className="w-64 glass border-r border-white/10 p-4 flex flex-col">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-cyan-400" />
          Build Phase
        </h2>
        <div className="space-y-2 text-sm text-gray-400">
          <div className="p-2 rounded bg-white/5">Team Chat</div>
          <div className="p-2 rounded bg-white/5">Figma</div>
          <div className="p-2 rounded bg-white/5">GitHub</div>
          <div className="p-2 rounded bg-cyan-500/10 text-cyan-300 font-medium">AI Tools</div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">Hackathon Progress</p>
          <div className="space-y-2">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2 text-xs">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  step.done ? 'bg-emerald-500' : 'bg-white/10 border border-white/20'
                }`}>
                  {step.done && <Check size={10} className="text-white" />}
                </div>
                <span className={step.done ? 'text-gray-300' : 'text-gray-500'}>{step.label}</span>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px ${step.done ? 'bg-emerald-500/50' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Ship It button - always visible */}
        <div className="mt-auto pt-4">
          <ArcadeButton variant="cyan" onClick={handleShipIt} className="w-full">
            <Rocket size={16} className="inline mr-2" />
            Ship It!
          </ArcadeButton>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Safety Net & AI Tools</h1>

        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Panic Button */}
          <GlowCard glowColor="cyan">
            <h3 className="font-bold mb-3 text-sm uppercase tracking-wider text-gray-400">
              Panic Button
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Stuck? Hit the panic button for instant AI-powered help.
            </p>
            <ArcadeButton
              variant="red"
              pulse
              onClick={() => setShowPanic(true)}
              className="w-full"
            >
              <AlertTriangle size={16} className="inline mr-2" />
              PANIC!
            </ArcadeButton>
          </GlowCard>

          {/* Vibe Coding */}
          <GlowCard glowColor="green">
            <h3 className="font-bold mb-3 text-sm uppercase tracking-wider text-gray-400">
              Vibe Coding
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Let Gemini scaffold code for you. Describe what you want.
            </p>
            <ArcadeButton
              variant="green"
              onClick={() => setVibePhase('prompt')}
              className="w-full"
              disabled={vibePhase !== 'prompt' && vibePhase !== 'pushed'}
            >
              <Bot size={16} className="inline mr-2" />
              Vibe Code
            </ArcadeButton>
          </GlowCard>

          {/* Build & Deploy */}
          <GlowCard glowColor="yellow">
            <h3 className="font-bold mb-3 text-sm uppercase tracking-wider text-gray-400">
              Build & Deploy
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Run CI/CD pipeline and deploy to Cloud Run.
            </p>
            <ArcadeButton
              variant="yellow"
              onClick={() => setBuildPhase('building')}
              className="w-full"
              disabled={buildPhase === 'building'}
            >
              <Cloud size={16} className="inline mr-2" />
              {buildPhase === 'done' ? 'Deployed!' : 'Build & Deploy'}
            </ArcadeButton>
          </GlowCard>
        </div>

        {/* Vibe Coding Flow */}
        <AnimatePresence mode="wait">
          {vibePhase === 'prompt' && (
            <motion.div
              key="vibe-prompt"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <div className="glass rounded-xl p-4 border border-white/10">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Describe what you want to build</p>
                <form onSubmit={(e) => { e.preventDefault(); handleVibeSubmit(); }} className="flex gap-3">
                  <input
                    type="text"
                    value={vibePrompt}
                    onChange={(e) => setVibePrompt(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                    placeholder="e.g., add a dark-mode user dashboard"
                  />
                  <ArcadeButton variant="green" size="sm" type="submit">
                    <Send size={14} className="inline mr-1" />
                    Generate
                  </ArcadeButton>
                </form>
              </div>
            </motion.div>
          )}

          {vibePhase === 'generating' && (
            <motion.div
              key="vibe-generating"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <Terminal
                lines={vibeCodingLines}
                speed={35}
                title="gemini-cli"
                onComplete={() => setVibePhase('review')}
              />
            </motion.div>
          )}

          {vibePhase === 'review' && (
            <motion.div
              key="vibe-review"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 space-y-4"
            >
              <div className="glass rounded-xl p-4 border border-emerald-500/20">
                <p className="text-sm text-emerald-400 font-medium mb-2">
                  Generated 3 components, 2 hooks, 1 layout
                </p>
                <p className="text-sm text-gray-400">Accept these changes?</p>
              </div>
              <div className="flex gap-3">
                <ArcadeButton variant="green" onClick={handleVibeAccept}>
                  <Check size={16} className="inline mr-1" />
                  Accept Changes
                </ArcadeButton>
                <ArcadeButton variant="red" onClick={handleVibeReject}>
                  Reject
                </ArcadeButton>
              </div>
            </motion.div>
          )}

          {vibePhase === 'pushing' && (
            <motion.div
              key="vibe-pushing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <Terminal
                lines={gitPushLines}
                speed={30}
                title="terminal"
                onComplete={() => setVibePhase('pushed')}
              />
            </motion.div>
          )}

          {vibePhase === 'pushed' && (
            <motion.div
              key="vibe-pushed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <div className="glass rounded-xl p-4 border border-emerald-500/30 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Check size={16} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-emerald-400 font-medium text-sm">Pushed to main</p>
                  <p className="text-xs text-gray-500">Changes committed and pushed successfully</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Build & Deploy Terminal */}
        <AnimatePresence>
          {buildPhase === 'building' && (
            <motion.div
              key="build-terminal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <Terminal
                lines={buildDeployLines}
                speed={30}
                title="ci-cd"
                onComplete={() => setBuildPhase('done')}
              />
            </motion.div>
          )}

          {buildPhase === 'done' && (
            <motion.div
              key="build-done"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="glass rounded-xl p-4 border border-emerald-500/30 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Check size={16} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-emerald-400 font-medium text-sm">Deployed successfully</p>
                  <p className="text-xs text-gray-500 font-mono">https://ai-tamagotchi.hackade.dev</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Panic Modal */}
        <Modal isOpen={showPanic} onClose={() => setShowPanic(false)} title="Gemini AI Assistant">
          <div className="space-y-4">
            {!panicSubmitted ? (
              <>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Describe your problem</p>
                  <textarea
                    value={panicInput}
                    onChange={(e) => setPanicInput(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 resize-none"
                    rows={3}
                  />
                </div>
                <ArcadeButton variant="red" onClick={() => setPanicSubmitted(true)} className="w-full">
                  <Send size={14} className="inline mr-1" />
                  Get Help
                </ArcadeButton>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <Bot size={16} className="text-blue-400" />
                  </div>
                  <div className="glass rounded-lg p-3 text-sm">
                    <TypingEffect
                      text="I've analyzed your project structure. It looks like your API integration is missing error handling for the Gemini response parser. Here's what I suggest: wrap the fetchPetState() call in a try-catch and add a retry mechanism with exponential backoff. Want me to generate the code?"
                      speed={20}
                      onComplete={() => setAiTypingDone(true)}
                    />
                  </div>
                </div>

                {aiTypingDone && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 justify-end"
                  >
                    <ArcadeButton variant="cyan" size="sm">
                      Generate Fix
                    </ArcadeButton>
                    <ArcadeButton
                      variant="yellow"
                      size="sm"
                      onClick={handleEscalate}
                      disabled={escalated}
                    >
                      <User size={14} className="inline mr-1" />
                      {escalated ? 'Mentor Notified!' : 'Escalate to Mentor'}
                    </ArcadeButton>
                  </motion.div>
                )}

                {escalated && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-lg p-3 border border-emerald-500/20"
                  >
                    <p className="text-sm text-emerald-400 font-medium">Mentor has been notified!</p>
                    <p className="text-xs text-gray-500">ETA: 2 minutes</p>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
}
