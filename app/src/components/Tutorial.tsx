import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Plane, Skull, Heart, Shield, Package, DollarSign, AlertTriangle, Star } from 'lucide-react';

export function Tutorial() {
  const setScreen = useGameStore(s => s.setScreen);

  const sections = [
    {
      icon: <TrendingUp size={20} className="text-[#00FF41]" />,
      title: 'THE BASICS',
      content: 'You are a dealer with a debt to pay. Travel between cities, buy products at low prices, and sell them at high prices. Pay off your loan shark before the final week or it\'s game over!'
    },
    {
      icon: <DollarSign size={20} className="text-[#FFB800]" />,
      title: 'BUYING & SELLING',
      content: 'Each city has different prices for 6 products. Prices change every time you travel or advance a week. Buy products when prices are low (green indicator) and sell when high. Use BUY MAX to buy as much as you can afford. Use SELL ALL to dump your entire stock.'
    },
    {
      icon: <Plane size={20} className="text-[#00CCFF]" />,
      title: 'TRAVELING',
      content: 'Travel costs money and advances time by 1 week. Each travel triggers a 10% interest on your debt. There\'s also a chance of random events: police encounters, muggers, market crashes, or lucky breaks. Higher heat = more police attention.'
    },
    {
      icon: <Package size={20} className="text-[#00FF41]" />,
      title: 'INVENTORY',
      content: 'You have limited inventory space. Each dealer type gives different starting space. COKE takes 2 slots per unit, everything else takes 1. Manage your space wisely - you can\'t buy more than you can carry!'
    },
    {
      icon: <Skull size={20} className="text-[#FF0055]" />,
      title: 'THE LOAN SHARK',
      content: 'Your debt grows by 10% every week via compound interest. Visit the SHARK tab to make payments. Priority: pay off debt before the final week. If you reach the last week with unpaid debt, it\'s GAME OVER.'
    },
    {
      icon: <Heart size={20} className="text-[#FF0055]" />,
      title: 'COMBAT & EVENTS',
      content: 'Random events can hurt you. In police encounters, you can FIGHT (take damage), BRIBE (pay cash), or FLEE (minor damage + cash loss). If your health hits zero, you die. Some dealers have combat bonuses.'
    },
    {
      icon: <Star size={20} className="text-[#FFB800]" />,
      title: 'STAR RATINGS',
      content: 'Win a city to earn stars and unlock the next: 1 Star = Survive and pay debt. 2 Stars = Profit over $100,000. 3 Stars = Profit over $500,000. Each city gets progressively harder with more debt, less time, and higher police presence.'
    },
    {
      icon: <Shield size={20} className="text-[#00CC66]" />,
      title: 'DEALER TYPES',
      content: 'FAST HANDS: +20 inventory space. IRON SKIN: +50 max health. SHARPSHOOTER: +15 weapon damage. CONNECTED: -5% police encounters. LUCKY: Better market prices. Choose a dealer that matches your playstyle!'
    },
  ];

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
        <h1 className="font-pixel text-lg text-[#00FF41] neon-text">HOW TO PLAY</h1>
      </div>

      {/* Tutorial Content */}
      <div className="relative z-10 flex-1 overflow-y-auto scroll-hide p-4">
        <div className="max-w-lg mx-auto space-y-3">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="game-panel p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                {section.icon}
                <h3 className="text-[#00FF41] font-pixel text-xs">{section.title}</h3>
              </div>
              <p className="text-[#E0E0E0] text-sm leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}

          {/* Quick Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="game-panel-red p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={18} className="text-[#FF0055]" />
              <h3 className="text-[#FF0055] font-pixel text-xs">QUICK TIPS</h3>
            </div>
            <ul className="text-[#E0E0E0] text-sm space-y-1">
              <li>- Early weeks: focus on cheap products (Weed, Shrooms) to build capital</li>
              <li>- Mid game: move into higher-value products (Speed, Heroin)</li>
              <li>- Late game: COKE has the biggest profit margins but takes 2x space</li>
              <li>- Always keep cash for travel costs</li>
              <li>- Pay debt early to avoid compounding interest</li>
              <li>- In fights: bribe if you have cash, fight if you have health</li>
            </ul>
          </motion.div>

          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}
