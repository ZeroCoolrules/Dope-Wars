import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { MainMenu } from '@/components/MainMenu';
import { LevelSelect } from '@/components/LevelSelect';
import { DealerSelect } from '@/components/DealerSelect';
import { GameScreen } from '@/components/GameScreen';
import { GameOver } from '@/components/GameOver';
import { Leaderboard } from '@/components/Leaderboard';
import { Settings } from '@/components/Settings';
import { TutorialSlideshow } from '@/components/TutorialSlideshow';
import { EventModal } from '@/components/EventModal';
import { AnimatePresence } from 'framer-motion';

function App() {
  const screen = useGameStore(s => s.screen);
  const currentEvent = useGameStore(s => s.currentEvent);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = '#1A1C23';
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case 'menu':
        return <MainMenu onShowTutorial={() => setShowTutorial(true)} />;
      case 'levelSelect':
        return <LevelSelect />;
      case 'dealerSelect':
        return <DealerSelect />;
      case 'playing':
        return <GameScreen onShowTutorial={() => setShowTutorial(true)} />;
      case 'gameOver':
        return <GameOver />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'settings':
        return <Settings />;
      default:
        return <MainMenu onShowTutorial={() => setShowTutorial(true)} />;
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#1A1C23]">
      {/* CRT Scanline overlay */}
      <div className="absolute inset-0 crt-scanlines z-50 pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 w-full h-full">
        {renderScreen()}
      </div>

      {/* Tutorial slideshow overlay */}
      <AnimatePresence>
        {showTutorial && (
          <TutorialSlideshow onClose={() => setShowTutorial(false)} />
        )}
      </AnimatePresence>

      {/* Event modal overlay */}
      {currentEvent && screen === 'playing' && (
        <EventModal />
      )}
    </div>
  );
}

export default App;
