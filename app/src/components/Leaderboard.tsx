import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Medal } from 'lucide-react';

export function Leaderboard() {
  const setScreen = useGameStore(s => s.setScreen);
  const leaderboard = useGameStore(s => s.leaderboard);

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: 'url(/city-bg.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1C23]/95 to-[#1A1C23]/98" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-4 p-4 border-b border-[#FFB800]/30">
        <button onClick={() => setScreen('menu')} className="btn-neon p-2">
          <ArrowLeft size={20} />
        </button>
        <Trophy size={24} className="text-[#FFB800]" />
        <h1 className="font-pixel text-lg text-[#FFB800] neon-text-gold">LEADERBOARD</h1>
      </div>

      {/* Leaderboard List */}
      <div className="relative z-10 flex-1 overflow-y-auto scroll-hide p-4">
        {leaderboard.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Trophy size={64} className="text-[#333] mb-4" />
            <p className="text-[#6B7280] text-lg">No scores yet.</p>
            <p className="text-[#6B7280] text-sm mt-1">Complete a run to save your score!</p>
          </div>
        ) : (
          <div className="max-w-xl mx-auto space-y-2">
            {/* Header row */}
            <div className="flex items-center gap-2 px-3 py-2 text-[#6B7280] text-xs font-bold">
              <span className="w-8">#</span>
              <span className="flex-1">NAME</span>
              <span className="w-24 text-right">SCORE</span>
              <span className="w-20 text-right hidden sm:block">PROFIT</span>
              <span className="w-16 text-right hidden md:block">CITY</span>
            </div>

            {leaderboard.map((entry, index) => {
              const isTop3 = index < 3;
              const rankIcon = index === 0 ? <Medal size={16} className="text-[#FFB800]" /> :
                              index === 1 ? <Medal size={16} className="text-[#C0C0C0]" /> :
                              index === 2 ? <Medal size={16} className="text-[#CD7F32]" /> :
                              <span className="text-[#6B7280] text-xs w-4 text-center">{index + 1}</span>;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded ${
                    isTop3
                      ? 'bg-[#FFB800]/10 border border-[#FFB800]/30'
                      : 'bg-[#252833]/50 border border-[#333]/50'
                  }`}
                >
                  <div className="w-8 flex items-center justify-center">
                    {rankIcon}
                  </div>
                  <span className={`flex-1 font-bold text-sm truncate ${
                    isTop3 ? 'text-[#FFB800]' : 'text-[#E0E0E0]'
                  }`}>
                    {entry.name}
                  </span>
                  <span className="w-24 text-right text-[#00FF41] font-mono-pixel text-sm">
                    ${entry.score.toLocaleString()}
                  </span>
                  <span className={`w-20 text-right font-mono-pixel text-xs hidden sm:block ${
                    entry.profit >= 0 ? 'text-[#00CC66]' : 'text-[#FF4444]'
                  }`}>
                    {entry.profit >= 0 ? '+' : ''}${entry.profit.toLocaleString()}
                  </span>
                  <span className="w-16 text-right text-[#6B7280] text-xs hidden md:block">
                    {entry.city}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
