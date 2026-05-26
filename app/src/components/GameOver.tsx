import { useState } from 'react';
import { useGameStore, CITIES } from '@/store/gameStore';
import { motion } from 'framer-motion';
import { Trophy, Skull, RotateCcw, Home, Star, Twitter } from 'lucide-react';

export function GameOver() {
  const setScreen = useGameStore(s => s.setScreen);
  const gameWon = useGameStore(s => s.gameWon);
  const cash = useGameStore(s => s.cash);
  const debt = useGameStore(s => s.debt);
  const currentCity = useGameStore(s => s.currentCity);
  const currentWeek = useGameStore(s => s.currentWeek);
  const maxWeeks = useGameStore(s => s.maxWeeks);
  const inventory = useGameStore(s => s.inventory);
  const marketPrices = useGameStore(s => s.marketPrices);
  const saveHighScore = useGameStore(s => s.saveHighScore);
  const selectedLevel = useGameStore(s => s.selectedLevel);
  const citiesUnlocked = useGameStore(s => s.citiesUnlocked);

  const [playerName, setPlayerName] = useState('');
  const [saved, setSaved] = useState(false);

  const city = CITIES.find(c => c.id === currentCity);
  const inventoryValue = inventory.reduce((sum, item) => {
    const mp = marketPrices.find(p => p.drugId === item.drugId);
    return sum + item.quantity * (mp?.price || 0);
  }, 0);
  const netWorth = cash - debt + inventoryValue;
  const profit = netWorth - (city?.startingDebt || 0);
  const stars = gameWon ? (profit > 500000 ? 3 : profit > 100000 ? 2 : 1) : 0;

  const handleSave = () => {
    if (!playerName.trim()) return;
    saveHighScore(playerName.trim());
    setSaved(true);
  };

  const handleShareTwitter = () => {
    const status = gameWon
      ? `Just conquered ${city?.name} in Dope Wars: Empire! Net Worth: $${netWorth.toLocaleString()} | Profit: $${profit.toLocaleString()} | Weeks: ${currentWeek}/${maxWeeks} | Stars: ${'\u2B50'.repeat(stars)}`
      : `Got taken down in ${city?.name} on Week ${currentWeek} of Dope Wars: Empire... Net Worth: $${netWorth.toLocaleString()} | The streets are ruthless.`;

    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(status)}&url=${encodeURIComponent('https://hmo67nhohw67m.kimi.page')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-y-auto scroll-hide">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: 'url(/city-bg.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1C23]/95 to-[#1A1C23]/98" />

      <motion.div
        className="relative z-10 w-[90%] max-w-md mx-auto py-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Result Header */}
        <div className="text-center mb-6">
          {gameWon ? (
            <>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}>
                <Trophy size={56} className="text-[#FFB800] mx-auto mb-2 neon-text-gold" />
              </motion.div>
              <h1 className="font-pixel text-2xl text-[#00FF41] neon-text">VICTORY!</h1>
              <p className="text-[#6B7280] text-sm mt-1">You survived all {maxWeeks} weeks!</p>
            </>
          ) : (
            <>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}>
                <Skull size={56} className="text-[#FF0055] mx-auto mb-2 neon-text-red" />
              </motion.div>
              <h1 className="font-pixel text-2xl text-[#FF0055] neon-text-red">GAME OVER</h1>
              <p className="text-[#6B7280] text-sm mt-1">
                {currentWeek >= maxWeeks ? "Couldn't pay the debt in time." : "You didn't survive the streets."}
              </p>
            </>
          )}
        </div>

        {/* Stats Panel */}
        <div className="game-panel p-4 mb-4 space-y-3">
          {/* Stars */}
          {gameWon && (
            <div className="flex justify-center gap-2 mb-3">
              {[1, 2, 3].map(s => (
                <motion.div
                  key={s}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5 + s * 0.2, type: 'spring' }}
                >
                  <Star size={28} className={s <= stars ? 'text-[#FFB800] fill-[#FFB800]' : 'text-[#333]'} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-[#6B7280] text-sm">City:</span>
            <span className="text-[#FFB800] font-bold">{city?.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#6B7280] text-sm">Weeks Survived:</span>
            <span className="text-[#E0E0E0] font-mono-pixel">{currentWeek}/{maxWeeks}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#6B7280] text-sm">Cash:</span>
            <span className="text-[#00FF41] font-mono-pixel">${cash.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#6B7280] text-sm">Debt:</span>
            <span className="text-[#FF0055] font-mono-pixel">${debt.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#6B7280] text-sm">Inventory Value:</span>
            <span className="text-[#FFB800] font-mono-pixel">${inventoryValue.toLocaleString()}</span>
          </div>
          <div className="border-t border-[#00FF41]/20 pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-[#00FF41] font-bold">Net Worth:</span>
              <span className={`font-pixel text-lg ${netWorth >= 0 ? 'text-[#00FF41]' : 'text-[#FF0055]'}`}>
                ${netWorth.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-[#6B7280] text-sm">Total Profit:</span>
              <span className={`font-mono-pixel ${profit >= 0 ? 'text-[#00CC66]' : 'text-[#FF4444]'}`}>
                {profit >= 0 ? '+' : ''}${profit.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Save Score */}
        {gameWon && !saved && (
          <motion.div className="game-panel p-4 mb-4" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
            <h3 className="text-[#FFB800] font-pixel text-xs mb-2">SAVE YOUR SCORE</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value.slice(0, 12))}
                placeholder="Enter name..."
                className="flex-1 bg-[#1A1C23] border border-[#00FF41]/50 text-[#E0E0E0] px-3 py-2 text-sm rounded focus:outline-none focus:border-[#00FF41] font-mono-pixel"
              />
              <button onClick={handleSave} disabled={!playerName.trim()} className="btn-neon px-4 py-2 disabled:opacity-30">
                SAVE
              </button>
            </div>
          </motion.div>
        )}

        {saved && (
          <motion.p className="text-[#00FF41] text-center text-sm mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Score saved!
          </motion.p>
        )}

        {/* Share to Twitter */}
        <motion.div className="mb-4" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
          <button
            onClick={handleShareTwitter}
            className="w-full py-3 flex items-center justify-center gap-2 font-bold uppercase tracking-wider transition-all"
            style={{
              background: '#1DA1F2',
              color: '#fff',
              border: '1px solid #1DA1F2',
              fontFamily: "'Pixelify Sans', monospace",
            }}
          >
            <Twitter size={18} />
            SHARE SCORE TO X / TWITTER
          </button>
        </motion.div>

        {/* Next city unlock */}
        {gameWon && selectedLevel && (
          <motion.div className="game-panel p-3 mb-4 text-center" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }}>
            {(() => {
              const cityIndex = CITIES.findIndex(c => c.id === selectedLevel);
              if (cityIndex >= 0 && cityIndex < CITIES.length - 1) {
                const nextCity = CITIES[cityIndex + 1];
                const newlyUnlocked = !citiesUnlocked.includes(nextCity.id);
                return (
                  <>
                    {newlyUnlocked && <p className="text-[#00FF41] font-bold text-sm">New city unlocked!</p>}
                    <p className="text-[#FFB800] font-pixel text-sm mt-1">{nextCity.name}</p>
                    <p className="text-[#6B7280] text-xs mt-1">{nextCity.description}</p>
                  </>
                );
              }
              return <p className="text-[#FFB800] font-pixel text-sm">All cities conquered!</p>;
            })()}
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button onClick={() => setScreen('levelSelect')} className="btn-neon py-3 flex items-center justify-center gap-2">
            <RotateCcw size={18} />
            PLAY AGAIN
          </button>
          <button onClick={() => setScreen('menu')} className="btn-neon-gold py-3 flex items-center justify-center gap-2">
            <Home size={18} />
            MAIN MENU
          </button>
        </div>
      </motion.div>
    </div>
  );
}
