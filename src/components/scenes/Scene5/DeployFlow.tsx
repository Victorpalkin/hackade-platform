'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Globe, Video, FileText, ExternalLink, Check, Loader2, Upload, ArrowRight } from 'lucide-react';
import ReactConfetti from 'react-confetti';
import Link from 'next/link';
import { ArcadeButton } from '@/components/ui/ArcadeButton';
import { GlowCard } from '@/components/ui/GlowCard';
import { TypingEffect } from '@/components/ui/TypingEffect';
import { mockSubmission } from '@/lib/mock-data';
import type { Submission } from '@/lib/types';

type Phase = 'deploy' | 'deploying' | 'deployed' | 'record' | 'recording' | 'submit' | 'scanning' | 'submitted';

interface DeployFlowProps {
  submission?: Submission;
  onSubmit?: (data: Submission) => void;
}

export function DeployFlow({ submission, onSubmit }: DeployFlowProps) {
  const data = submission || mockSubmission;
  const [phase, setPhase] = useState<Phase>('deploy');
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  const handleDeploy = () => {
    setPhase('deploying');
    setTimeout(() => {
      setPhase('deployed');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }, 2000);
  };

  const handleRecord = () => {
    setPhase('recording');
    setTimeout(() => setPhase('submit'), 2000);
  };

  const handleSubmit = () => {
    setPhase('scanning');
    setTimeout(() => {
      setPhase('submitted');
      if (onSubmit) {
        onSubmit(data);
      }
    }, 2500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 grid-bg relative">
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={300}
          colors={['#00f0ff', '#ff00ff', '#00ff88', '#ffdd00']}
        />
      )}

      <AnimatePresence mode="wait">
        {/* Deploy Phase */}
        {(phase === 'deploy' || phase === 'deploying') && (
          <motion.div
            key="deploy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <Rocket size={48} className="text-cyan-400 mx-auto mb-6" />
            <h1 className="text-4xl font-bold glow-text-cyan mb-4">SHIP IT</h1>
            <p className="text-gray-400 mb-8">Deploy your project to the world</p>

            {phase === 'deploying' ? (
              <div className="flex items-center gap-3 justify-center text-cyan-400">
                <Loader2 size={24} className="animate-spin" />
                <span className="text-lg font-medium">Deploying...</span>
              </div>
            ) : (
              <ArcadeButton variant="cyan" size="lg" pulse onClick={handleDeploy}>
                <Upload size={18} className="inline mr-2" />
                Deploy Project
              </ArcadeButton>
            )}
          </motion.div>
        )}

        {/* Deployed */}
        {phase === 'deployed' && (
          <motion.div
            key="deployed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
            >
              <Check size={64} className="text-emerald-400 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-3xl font-bold glow-text-green mb-2">DEPLOYED!</h2>
            <div className="glass rounded-lg p-4 mb-8 inline-flex items-center gap-2">
              <Globe size={16} className="text-cyan-400" />
              <span className="font-mono text-cyan-300 text-sm">{data.url}</span>
              <ExternalLink size={14} className="text-gray-500" />
            </div>
            <br />
            <ArcadeButton variant="magenta" size="lg" onClick={() => setPhase('record')}>
              <Video size={18} className="inline mr-2" />
              Record Pitch
            </ArcadeButton>
          </motion.div>
        )}

        {/* Record Phase */}
        {(phase === 'record' || phase === 'recording') && (
          <motion.div
            key="record"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center relative"
          >
            <Video size={48} className="text-fuchsia-400 mx-auto mb-6" />
            <h1 className="text-4xl font-bold glow-text-magenta mb-4">RECORD YOUR PITCH</h1>
            <p className="text-gray-400 mb-8">3-minute video pitch for the judges</p>

            {phase === 'recording' ? (
              <div className="relative">
                {/* Mock recorder overlay */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass rounded-xl p-6 inline-block"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-red-400 text-sm font-mono">REC 00:42</span>
                  </div>
                  <div className="w-64 h-36 rounded-lg bg-gray-800 mb-3 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-fuchsia-500 flex items-center justify-center text-xl font-bold">
                      Y
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Mock webcam preview</p>
                </motion.div>
              </div>
            ) : (
              <ArcadeButton variant="red" size="lg" onClick={handleRecord}>
                Start Recording
              </ArcadeButton>
            )}
          </motion.div>
        )}

        {/* Submit Phase */}
        {(phase === 'submit' || phase === 'scanning') && (
          <motion.div
            key="submit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <FileText size={48} className="text-accent-yellow mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4" style={{ textShadow: '0 0 10px rgba(255,221,0,0.6)' }}>
              GENERATE SUBMISSION
            </h1>
            <p className="text-gray-400 mb-8">AI will scan your project and create a Devpost-style submission</p>

            {phase === 'scanning' ? (
              <div className="flex flex-col items-center gap-3 text-cyan-400">
                <Loader2 size={32} className="animate-spin" />
                <TypingEffect text="Scanning project... Analyzing code... Generating submission..." speed={40} />
              </div>
            ) : (
              <ArcadeButton variant="yellow" size="lg" onClick={handleSubmit}>
                Generate Submission
              </ArcadeButton>
            )}
          </motion.div>
        )}

        {/* Submitted */}
        {phase === 'submitted' && (
          <motion.div
            key="submitted"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl"
          >
            <GlowCard glowColor="yellow" hover={false} className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <FileText size={20} className="text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{data.projectName}</h2>
                  <p className="text-sm text-gray-500">Hackade Submission</p>
                </div>
              </div>

              <p className="text-gray-300 mb-4">{data.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="glass rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Live Demo</p>
                  <div className="flex items-center gap-2 text-cyan-400 text-sm">
                    <Globe size={14} />
                    <span className="font-mono">{data.url}</span>
                  </div>
                </div>
                <div className="glass rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Pitch Video</p>
                  <div className="flex items-center gap-2 text-fuchsia-400 text-sm">
                    <Video size={14} />
                    <span className="font-mono">3:00 recorded</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Sponsor Tracks</p>
                <div className="flex gap-2">
                  {data.tracks.map((track) => (
                    <span key={track} className="text-xs px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-500/20">
                      {track}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">Team</p>
                <div className="flex gap-2">
                  {data.teamMembers.map((member) => (
                    <span key={member} className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-300">
                      {member}
                    </span>
                  ))}
                </div>
              </div>
            </GlowCard>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center mt-6"
            >
              <p className="text-emerald-400 font-bold text-lg glow-text-green mb-4">
                Submission Complete! Good luck!
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/quests">
                  <ArcadeButton variant="cyan">
                    Back to Quests
                  </ArcadeButton>
                </Link>
                <Link href="/teams">
                  <ArcadeButton variant="magenta">
                    View My Teams <ArrowRight size={14} className="inline ml-1" />
                  </ArcadeButton>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
