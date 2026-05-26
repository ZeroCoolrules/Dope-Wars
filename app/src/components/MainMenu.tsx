import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';
import { Play, Trophy, Settings, HelpCircle } from 'lucide-react';

interface MainMenuProps {
  onShowTutorial: () => void;
}

export function MainMenu({ onShowTutorial }: MainMenuProps) {
  const setScreen = useGameStore(s => s.setScreen);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: 'url(/city-bg.jpg)' }}
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1C23]/80 via-[#1A1C23]/60 to-[#1A1C23]/90" />

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#00FF41] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.3 + Math.random() * 0.5,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4">
        {/* Title */}
        <motion.div
          className="text-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
        >
          <h1 className="font-pixel text-3xl md:text-5xl text-[#00FF41] neon-text tracking-wider">
            DOPE WARS
          </h1>
          <h2 className="font-pixel text-lg md:text-2xl text-[#FFB800] neon-text-gold mt-2 tracking-widest">
            EMPIRE
          </h2>
          <p className="text-[#6B7280] text-sm mt-2 font-mono-pixel text-lg">Buy Low. Sell High. Stay Alive.</p>
        </motion.div>

        {/* Player portrait */}
        <motion.div
          className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-[#00FF41] shadow-[0_0_20px_rgba(0,255,65,0.3)]"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          <img src="/player.png" alt="Player" className="w-full h-full object-cover" />
        </motion.div>

        {/* Menu buttons */}
        <motion.div
          className="flex flex-col gap-3 w-64"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <button
            onClick={() => setScreen('levelSelect')}
            className="btn-neon flex items-center justify-center gap-3 py-3 text-lg animate-pulse-glow"
          >
            <Play size={20} />
            START GAME
          </button>

          <button
            onClick={() => setScreen('leaderboard')}
            className="btn-neon-gold flex items-center justify-center gap-3 py-3"
          >
            <Trophy size={20} />
            LEADERBOARD
          </button>

          <button
            onClick={onShowTutorial}
            className="btn-neon flex items-center justify-center gap-3 py-3 border-[#00CCFF] text-[#00CCFF] hover:bg-[#00CCFF]/10"
            style={{ borderColor: '#00CCFF', color: '#00CCFF' }}
          >
            <HelpCircle size={20} />
            HOW TO PLAY
          </button>

          <button
            onClick={() => setScreen('settings')}
            className="btn-neon flex items-center justify-center gap-3 py-3"
          >
            <Settings size={20} />
            SETTINGS
          </button>
        </motion.div>

        {/* Version */}
        <p className="text-[#6B7280] text-xs mt-4 font-mono-pixel">v1.3 | All Cities Open</p>
      </div>
    </div>
  );
}
