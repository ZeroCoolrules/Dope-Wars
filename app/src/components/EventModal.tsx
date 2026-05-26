import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';
import { Swords, Coins, Footprints, Shield, Heart, Frown } from 'lucide-react';

export function EventModal() {
  const currentEvent = useGameStore(s => s.currentEvent);
  const resolveEvent = useGameStore(s => s.resolveEvent);
  const cash = useGameStore(s => s.cash);

  if (!currentEvent) return null;

  const handleChoice = (choiceId: string) => resolveEvent(choiceId);
  const handleAuto = () => resolveEvent();

  const isAuto = !currentEvent.choices || currentEvent.choices.length === 0;
  const isOldLady = currentEvent.type === 'old_lady';
  const isDanger = currentEvent.type === 'cop' || currentEvent.type === 'mugger';

  // Color theme based on event type
  const themeColor = isOldLady ? '#FF66AA' : isDanger ? '#FF0055' : '#FFB800';
  const themeGlow = isOldLady ? 'rgba(255,102,170,0.3)' : isDanger ? 'rgba(255,0,85,0.3)' : 'rgba(255,184,0,0.3)';
  const borderClass = isOldLady ? 'border-[#FF66AA]/50' : isDanger ? 'border-[#FF0055]/50' : 'border-[#FFB800]/50';
  const bgClass = isOldLady ? 'bg-[#FF66AA]/5' : isDanger ? 'bg-[#FF0055]/5' : 'bg-[#FFB800]/5';
  const iconColor = isOldLady ? 'text-[#FF66AA]' : isDanger ? 'text-[#FF0055]' : 'text-[#FFB800]';

  const getChoiceIcon = (choiceId: string, eventType: string) => {
    if (eventType === 'old_lady') {
      if (choiceId === 'visit') return <Heart size={16} />;
      if (choiceId === 'ignore') return <Frown size={16} />;
    }
    if (choiceId === 'fight') return <Swords size={16} />;
    if (choiceId === 'bribe' || choiceId === 'pay') return <Coins size={16} />;
    if (choiceId === 'flee' || choiceId === 'run') return <Footprints size={16} />;
    return <Shield size={16} />;
  };

  const getChoiceStyle = (choiceId: string) => {
    if (isOldLady && choiceId === 'visit') return 'btn-neon';
    if (isOldLady && choiceId === 'ignore') return 'btn-neon-red';
    if (choiceId === 'fight' || choiceId === 'flee' || choiceId === 'run') return 'btn-neon-red';
    return 'btn-neon-gold';
  };

  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`w-[90%] max-w-md p-6 mx-4 border-2 ${borderClass} ${bgClass}`}
        style={{
          background: 'rgba(26, 28, 35, 0.95)',
          boxShadow: `0 0 25px ${themeGlow}`,
        }}
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Event Header */}
        <div className="text-center mb-4">
          {isOldLady ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <Heart size={40} className={`${iconColor} mx-auto mb-2`} style={{ filter: `drop-shadow(0 0 10px ${themeColor})` }} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <Swords size={40} className={`${iconColor} mx-auto mb-2`} style={{ filter: `drop-shadow(0 0 10px ${themeColor})` }} />
            </motion.div>
          )}
          <h2
            className="font-pixel text-lg"
            style={{ color: themeColor, textShadow: `0 0 10px ${themeGlow}` }}
          >
            {currentEvent.title}
          </h2>
        </div>

        {/* Event Image */}
        {currentEvent.image && (
          <div className="flex justify-center mb-4">
            <div
              className="w-32 h-32 rounded-lg overflow-hidden border-2 flex items-center justify-center"
              style={{ borderColor: themeColor + '40', background: '#1A1C23' }}
            >
              <img
                src={currentEvent.image}
                alt={currentEvent.title}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        {/* Event Description */}
        <p className="text-[#E0E0E0] text-sm text-center mb-6 leading-relaxed">
          {currentEvent.description}
        </p>

        {/* Action Buttons */}
        {isAuto ? (
          <button
            onClick={handleAuto}
            className="w-full py-3 text-center font-bold uppercase tracking-wider transition-all"
            style={{
              background: '#252833',
              border: `1px solid ${themeColor}`,
              color: themeColor,
            }}
          >
            CONTINUE
          </button>
        ) : (
          <div className="space-y-2">
            {currentEvent.choices?.map(choice => {
              const disabled = choice.id === 'bribe' && cash < 5000;
              const IconComp = getChoiceIcon(choice.id, currentEvent.type);
              const styleClass = getChoiceStyle(choice.id);

              return (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  disabled={disabled}
                  className={`w-full py-3 px-4 flex items-center justify-center gap-2 transition-all ${
                    disabled
                      ? 'opacity-30 cursor-not-allowed border border-[#333] bg-[#252833] text-[#6B7280]'
                      : styleClass
                  }`}
                >
                  {IconComp}
                  <span className="text-sm font-bold">{choice.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
