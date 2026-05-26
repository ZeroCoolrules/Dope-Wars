import { useGameStore, DEALERS } from '@/store/gameStore';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Heart, Swords, Package, Eye, Clover } from 'lucide-react';

export function DealerSelect() {
  const setScreen = useGameStore(s => s.setScreen);
  const selectDealer = useGameStore(s => s.selectDealer);
  const startGame = useGameStore(s => s.startGame);
  const selectedDealer = useGameStore(s => s.selectedDealer);

  const handleSelectDealer = (dealerId: string) => {
    selectDealer(dealerId);
  };

  const handleStart = () => {
    if (!selectedDealer) return;
    startGame();
  };

  const getDealerIcon = (id: string) => {
    switch (id) {
      case 'fast_hands': return <Package size={24} className="text-[#00FF41]" />;
      case 'iron_skin': return <Heart size={24} className="text-[#FF0055]" />;
      case 'sharpshooter': return <Swords size={24} className="text-[#FFB800]" />;
      case 'connected': return <Eye size={24} className="text-[#00CCFF]" />;
      case 'lucky': return <Clover size={24} className="text-[#00CC66]" />;
      default: return <User size={24} />;
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: 'url(/city-bg.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1C23]/95 to-[#1A1C23]/98" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-4 p-4 border-b border-[#00FF41]/30">
        <button onClick={() => setScreen('levelSelect')} className="btn-neon p-2">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-pixel text-lg text-[#00FF41] neon-text">CHOOSE YOUR DEALER</h1>
      </div>

      {/* Dealer Cards */}
      <div className="relative z-10 flex-1 overflow-y-auto scroll-hide p-4">
        <div className="max-w-xl mx-auto space-y-3">
          {DEALERS.map((dealer, index) => {
            const isSelected = selectedDealer === dealer.id;
            return (
              <motion.button
                key={dealer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                onClick={() => handleSelectDealer(dealer.id)}
                className={`w-full p-4 text-left transition-all duration-200 ${
                  isSelected
                    ? 'game-panel shadow-[0_0_25px_rgba(0,255,65,0.4)]'
                    : 'border border-[#333] bg-[#252833]/50 hover:border-[#00FF41]/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    isSelected ? 'border-[#00FF41] bg-[#00FF41]/10' : 'border-[#333] bg-[#1A1C23]'
                  }`}>
                    {getDealerIcon(dealer.id)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-pixel text-sm ${isSelected ? 'text-[#00FF41]' : 'text-[#E0E0E0]'}`}>
                        {dealer.name}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] bg-[#00FF41]/20 text-[#00FF41] px-2 py-0.5 rounded">SELECTED</span>
                      )}
                    </div>
                    <p className="text-[#6B7280] text-xs mt-1">{dealer.description}</p>
                    <span className="text-[#FFB800] text-xs mt-1 inline-block">{dealer.perk}</span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Start Button */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={handleStart}
            disabled={!selectedDealer}
            className="btn-neon px-8 py-4 text-xl disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ENTER THE UNDERWORLD
          </button>
        </motion.div>
      </div>
    </div>
  );
}
