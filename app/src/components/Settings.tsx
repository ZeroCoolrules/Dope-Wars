import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, VolumeX, Music, Trash2, AlertTriangle } from 'lucide-react';

export function Settings() {
  const setScreen = useGameStore(s => s.setScreen);
  const soundEnabled = useGameStore(s => s.soundEnabled);
  const musicEnabled = useGameStore(s => s.musicEnabled);
  const toggleSound = useGameStore(s => s.toggleSound);
  const toggleMusic = useGameStore(s => s.toggleMusic);
  const resetProgress = useGameStore(s => s.resetProgress);

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: 'url(/city-bg.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1C23]/95 to-[#1A1C23]/98" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-4 p-4 border-b border-[#00FF41]/30">
        <button onClick={() => setScreen('menu')} className="btn-neon p-2">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-pixel text-lg text-[#00FF41] neon-text">SETTINGS</h1>
      </div>

      {/* Settings Content */}
      <div className="relative z-10 flex-1 overflow-y-auto scroll-hide p-4">
        <div className="max-w-md mx-auto space-y-4">
          {/* Sound Settings */}
          <div className="game-panel p-4">
            <h3 className="text-[#00FF41] font-pixel text-xs mb-3">AUDIO</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {soundEnabled ? <Volume2 size={18} className="text-[#00FF41]" /> : <VolumeX size={18} className="text-[#6B7280]" />}
                  <span className="text-[#E0E0E0] text-sm">Sound Effects</span>
                </div>
                <button
                  onClick={toggleSound}
                  className={`w-12 h-6 rounded-full transition-all relative ${
                    soundEnabled ? 'bg-[#00FF41]' : 'bg-[#333]'
                  }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                    soundEnabled ? 'left-6' : 'left-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music size={18} className={musicEnabled ? 'text-[#00FF41]' : 'text-[#6B7280]'} />
                  <span className="text-[#E0E0E0] text-sm">Music</span>
                </div>
                <button
                  onClick={toggleMusic}
                  className={`w-12 h-6 rounded-full transition-all relative ${
                    musicEnabled ? 'bg-[#00FF41]' : 'bg-[#333]'
                  }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                    musicEnabled ? 'left-6' : 'left-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Game Data */}
          <div className="game-panel-red p-4">
            <h3 className="text-[#FF0055] font-pixel text-xs mb-3 flex items-center gap-2">
              <Trash2 size={14} />
              DANGER ZONE
            </h3>
            
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="btn-neon-red w-full py-2 flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                RESET ALL PROGRESS
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#FF0055] text-sm">
                  <AlertTriangle size={16} />
                  <span>This will delete all saved scores and unlocks!</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="btn-neon-red flex-1 py-2 text-sm"
                  >
                    CONFIRM RESET
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="btn-neon flex-1 py-2 text-sm"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}

            {showSaved && (
              <motion.p
                className="text-[#00FF41] text-sm mt-2 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Progress reset successfully!
              </motion.p>
            )}
          </div>

          {/* About */}
          <div className="game-panel p-4">
            <h3 className="text-[#FFB800] font-pixel text-xs mb-2">ABOUT</h3>
            <p className="text-[#6B7280] text-xs leading-relaxed">
              Dope Wars: Empire is an extended tribute to the classic 2000s trading simulation game.
              Buy low, sell high, travel between cities, and pay off your debt before time runs out.
            </p>
            <p className="text-[#6B7280] text-xs mt-2">Version 1.0.0 | Built with React + TypeScript</p>
          </div>
        </div>
      </div>
    </div>
  );
}
