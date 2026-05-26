import { useGameStore, CITIES } from '@/store/gameStore';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, MapPin, DollarSign, Calendar, Shield } from 'lucide-react';

export function LevelSelect() {
  const setScreen = useGameStore(s => s.setScreen);
  const selectLevel = useGameStore(s => s.selectLevel);
  const citiesUnlocked = useGameStore(s => s.citiesUnlocked);

  const handleSelectCity = (cityId: string, unlocked: boolean) => {
    if (!unlocked) return;
    selectLevel(cityId);
    setScreen('dealerSelect');
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: 'url(/city-bg.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1C23]/90 to-[#1A1C23]/95" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-4 p-4 border-b border-[#00FF41]/30">
        <button onClick={() => setScreen('menu')} className="btn-neon p-2">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-pixel text-lg text-[#00FF41] neon-text">SELECT CITY</h1>
      </div>

      {/* City Grid */}
      <div className="relative z-10 flex-1 overflow-y-auto scroll-hide p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
          {CITIES.map((city, index) => {
            const unlocked = citiesUnlocked.includes(city.id);
            const difficulty = city.policeChance > 0.4 ? 'EXTREME' : city.policeChance > 0.3 ? 'HARD' : city.policeChance > 0.2 ? 'MEDIUM' : 'EASY';
            const diffColor = difficulty === 'EXTREME' ? 'text-[#FF0055]' : difficulty === 'HARD' ? 'text-[#FF4444]' : difficulty === 'MEDIUM' ? 'text-[#FFB800]' : 'text-[#00CC66]';

            return (
              <motion.button
                key={city.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelectCity(city.id, unlocked)}
                disabled={!unlocked}
                className={`relative p-4 text-left transition-all duration-200 ${
                  unlocked
                    ? 'game-panel hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] cursor-pointer'
                    : 'border border-[#333] bg-[#1A1C23]/80 opacity-50 cursor-not-allowed'
                }`}
              >
                {!unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Lock size={32} className="text-[#6B7280]" />
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className={unlocked ? 'text-[#00FF41]' : 'text-[#6B7280]'} />
                    <span className={`font-pixel text-sm ${unlocked ? 'text-[#E0E0E0]' : 'text-[#6B7280]'}`}>
                      {city.name}
                    </span>
                  </div>
                  <span className={`text-xs font-bold ${diffColor}`}>{difficulty}</span>
                </div>

                <p className="text-[#6B7280] text-xs mt-2">{city.description}</p>

                <div className="flex items-center gap-4 mt-3 text-xs">
                  <div className="flex items-center gap-1">
                    <DollarSign size={12} className="text-[#00FF41]" />
                    <span className="text-[#00FF41]">${city.startCash.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={12} className="text-[#FFB800]" />
                    <span className="text-[#FFB800]">{city.maxWeeks} wks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign size={12} className="text-[#FF0055]" />
                    <span className="text-[#FF0055]">${city.startingDebt.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield size={12} className="text-[#FF4444]" />
                    <span className="text-[#FF4444]">{Math.round(city.policeChance * 100)}%</span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Free Play Button */}
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => {
              selectLevel('bronx');
              setScreen('dealerSelect');
            }}
            className="btn-neon-gold px-6 py-3"
          >
            FREE PLAY (BRONX)
          </button>
        </motion.div>
      </div>
    </div>
  );
}
