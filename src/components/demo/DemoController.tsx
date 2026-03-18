'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SceneId } from '@/lib/types';
import { quests, projectCards, teamMembers } from '@/lib/mock-data';
import { ProfileImport } from '@/components/scenes/Scene0/ProfileImport';
import { CampaignMap } from '@/components/scenes/Scene1/CampaignMap';
import { SwipeCards } from '@/components/scenes/Scene1/SwipeCards';
import { MatchReveal } from '@/components/scenes/Scene1/MatchReveal';
import { CharacterSelect } from '@/components/scenes/Scene2/CharacterSelect';
import { WarRoom } from '@/components/scenes/Scene3/WarRoom';
import { SafetyNet } from '@/components/scenes/Scene4/SafetyNet';
import { DeployFlow } from '@/components/scenes/Scene5/DeployFlow';

type Scene1Phase = 'map' | 'swipe' | 'match';

export function DemoController() {
  const [currentScene, setCurrentScene] = useState<SceneId>(0);
  const [scene1Phase, setScene1Phase] = useState<Scene1Phase>('map');

  const advanceScene = useCallback(() => {
    if (currentScene === 1) {
      if (scene1Phase === 'map') {
        setScene1Phase('swipe');
        return;
      }
      if (scene1Phase === 'swipe') {
        setScene1Phase('match');
        return;
      }
    }
    if (currentScene < 5) {
      setCurrentScene((s) => (s + 1) as SceneId);
    }
  }, [currentScene, scene1Phase]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        advanceScene();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [advanceScene]);

  const sceneKey = currentScene === 1 ? `scene-1-${scene1Phase}` : `scene-${currentScene}`;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={sceneKey}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="w-full h-full"
        >
          {currentScene === 0 && (
            <ProfileImport onContinue={() => setCurrentScene(1)} />
          )}
          {currentScene === 1 && scene1Phase === 'map' && (
            <CampaignMap onSelectQuest={() => setScene1Phase('swipe')} quests={quests} />
          )}
          {currentScene === 1 && scene1Phase === 'swipe' && (
            <SwipeCards onMatch={() => setScene1Phase('match')} cards={projectCards} />
          )}
          {currentScene === 1 && scene1Phase === 'match' && (
            <MatchReveal onContinue={() => setCurrentScene(2)} />
          )}
          {currentScene === 2 && (
            <CharacterSelect onReady={() => setCurrentScene(3)} members={teamMembers} />
          )}
          {currentScene === 3 && (
            <WarRoom onReady={() => setCurrentScene(4)} />
          )}
          {currentScene === 4 && (
            <SafetyNet onContinue={() => setCurrentScene(5)} />
          )}
          {currentScene === 5 && <DeployFlow />}
        </motion.div>
      </AnimatePresence>

      {/* Scene indicator dots */}
      <div className="fixed bottom-4 right-4 flex gap-2 z-50">
        {([0, 1, 2, 3, 4, 5] as SceneId[]).map((scene) => (
          <button
            key={scene}
            onClick={() => {
              setCurrentScene(scene);
              if (scene === 1) setScene1Phase('map');
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
              scene === currentScene
                ? 'bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.6)]'
                : 'bg-white/20 hover:bg-white/40'
            }`}
            title={`Scene ${scene}`}
          />
        ))}
      </div>
    </div>
  );
}
