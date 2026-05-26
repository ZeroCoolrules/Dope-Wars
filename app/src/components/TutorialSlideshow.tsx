import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronLeft, ChevronRight, DollarSign, Skull, Heart,
  Package, MapPin, Plane, Clock, TrendingUp, TrendingDown,
  Plus, Minus, Trophy, AlertTriangle, Info
} from 'lucide-react';

interface TutorialSlideshowProps {
  onClose: () => void;
}

const slides = [
  {
    title: 'WELCOME TO THE GAME',
    color: '#00FF41',
    content: (
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full border-2 border-[#00FF41] flex items-center justify-center overflow-hidden">
            <img src="/player.png" alt="You" className="w-full h-full object-cover" />
          </div>
        </div>
        <p className="text-[#E0E0E0] text-sm text-center leading-relaxed">
          You are a street dealer trying to make it big. Buy products low, sell them high, travel between cities, and pay off your debt before time runs out.
        </p>
        <div className="game-panel p-3 text-center">
          <p className="text-[#FFB800] font-pixel text-xs">YOUR GOAL</p>
          <p className="text-[#E0E0E0] text-sm mt-1">Survive all 30 weeks with your debt paid off. Build the biggest empire.</p>
        </div>
      </div>
    ),
  },
  {
    title: 'THE HUD',
    color: '#00FF41',
    content: (
      <div className="space-y-3">
        <p className="text-[#6B7280] text-xs text-center">These stats are always visible at the top:</p>
        <div className="space-y-2">
          <div className="flex items-center gap-3 game-panel p-2">
            <MapPin size={16} className="text-[#FFB800]" />
            <div>
              <span className="text-[#FFB800] text-xs font-bold">CURRENT CITY</span>
              <p className="text-[#6B7280] text-[10px]">Where you are right now. Prices differ per city.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 game-panel p-2">
            <DollarSign size={16} className="text-[#00FF41]" />
            <div>
              <span className="text-[#00FF41] text-xs font-bold">CASH ON HAND</span>
              <p className="text-[#6B7280] text-[10px]">Money available to buy products and travel.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 game-panel-red p-2">
            <Skull size={16} className="text-[#FF0055]" />
            <div>
              <span className="text-[#FF0055] text-xs font-bold">DEBT</span>
              <p className="text-[#6B7280] text-[10px]">Grows 10% every week! Pay it off ASAP.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 game-panel p-2">
            <Heart size={16} className="text-[#FF0055]" />
            <div>
              <span className="text-[#FF0055] text-xs font-bold">HEALTH</span>
              <p className="text-[#6B7280] text-[10px]">If this hits zero, you die. Events can hurt you.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 game-panel p-2">
            <Package size={16} className="text-[#00FF41]" />
            <div>
              <span className="text-[#00FF41] text-xs font-bold">INVENTORY SPACE</span>
              <p className="text-[#6B7280] text-[10px]">How much you can carry. COKE takes 2 slots.</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'BUYING PRODUCTS',
    color: '#FFB800',
    content: (
      <div className="space-y-3">
        <p className="text-[#E0E0E0] text-sm text-center">Each product card shows the current price and how many you hold.</p>
        <div className="game-panel p-3">
          <div className="flex items-center gap-2 mb-2">
            <img src="/icon-weed.png" alt="weed" className="w-8 h-8" />
            <span className="text-[#E0E0E0] font-bold text-sm">WEED</span>
            <span className="text-[#FFB800] font-mono-pixel ml-auto">$500</span>
          </div>
          <div className="flex gap-1 mb-2">
            <span className="text-[9px] px-1.5 py-0.5 rounded border border-[#00FF41] text-[#00FF41]">MAX</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded border border-[#333] text-[#6B7280]">QTY</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <button className="p-0.5 text-[#00FF41]"><Minus size={10} /></button>
              <span className="text-[#E0E0E0] font-mono-pixel text-xs w-4 text-center">5</span>
              <button className="p-0.5 text-[#00FF41]"><Plus size={10} /></button>
              <span className="btn-neon py-0.5 px-2 text-[10px] ml-1">BUY</span>
            </div>
            <button className="btn-neon w-full py-1 text-xs">BUY MAX</button>
          </div>
        </div>
        <div className="space-y-1 text-xs">
          <p className="text-[#00FF41]"><TrendingUp size={12} className="inline mr-1" />Green +% = price is above your buy price (profit!)</p>
          <p className="text-[#FF4444]"><TrendingDown size={12} className="inline mr-1" />Red % = price is below your buy price (loss!)</p>
        </div>
      </div>
    ),
  },
  {
    title: 'QUANTITY MODE',
    color: '#FFB800',
    content: (
      <div className="space-y-3">
        <p className="text-[#E0E0E0] text-sm text-center">Tap the <span className="text-[#FFB800] border border-[#FFB800] px-1 text-xs">QTY</span> button to switch to custom quantity mode.</p>
        <div className="flex justify-center gap-4">
          <div className="text-center">
            <div className="flex items-center gap-1 mb-1">
              <button className="p-1 text-[#00FF41]"><Minus size={14} /></button>
              <span className="text-[#E0E0E0] font-mono-pixel w-6">3</span>
              <button className="p-1 text-[#00FF41]"><Plus size={14} /></button>
            </div>
            <span className="text-[#00FF41] text-xs">- / + to adjust</span>
          </div>
        </div>
        <div className="game-panel p-3">
          <p className="text-[#00FF41] font-pixel text-xs mb-1">WHEN TO USE QTY MODE</p>
          <ul className="text-[#E0E0E0] text-xs space-y-1">
            <li>- Buy exactly what you can afford</li>
            <li>- Sell only part of your stock</li>
            <li>- Test a small amount in a new city</li>
            <li>- Keep some inventory for later</li>
          </ul>
        </div>
        <div className="game-panel p-3">
          <p className="text-[#FFB800] font-pixel text-xs mb-1">WHEN TO USE MAX MODE</p>
          <ul className="text-[#E0E0E0] text-xs space-y-1">
            <li>- Price is super low, go all in</li>
            <li>- Need to dump inventory fast</li>
            <li>- Quick decisions on the move</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: 'ENDING THE WEEK',
    color: '#00CCFF',
    content: (
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="animate-pulse-glow">
            <button className="btn-neon py-3 px-6 flex items-center gap-2 text-base">
              <Clock size={18} />
              END WEEK
            </button>
          </div>
        </div>
        <p className="text-[#E0E0E0] text-sm text-center">The <span className="text-[#00FF41] font-bold">END WEEK</span> button is always visible below your stats.</p>
        <div className="game-panel p-3 space-y-2">
          <p className="text-[#FF0055] font-bold text-xs">WHAT HAPPENS:</p>
          <ul className="text-[#E0E0E0] text-xs space-y-1">
            <li>- Week counter increases by 1</li>
            <li>- All market prices randomly change</li>
            <li>- Debt grows by 10% interest</li>
            <li>- You pay $200 living expenses</li>
          </ul>
        </div>
        <div className="game-panel p-3 border-[#FFB800]/50">
          <p className="text-[#FFB800] text-xs font-bold">TIP: End week frequently to get new prices without paying travel costs!</p>
        </div>
      </div>
    ),
  },
  {
    title: 'TRAVELING',
    color: '#00CCFF',
    content: (
      <div className="space-y-3">
        <p className="text-[#E0E0E0] text-sm text-center">Fly to any of the 10 cities to find different prices.</p>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['BRONX', 'BROOKLYN', 'MIAMI', 'LA', 'CHICAGO'].map(c => (
            <span key={c} className="whitespace-nowrap px-2 py-1 rounded text-[10px] border border-[#FFB800]/50 text-[#FFB800]">{c}</span>
          ))}
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3 game-panel p-2">
            <Plane size={16} className="text-[#FFB800]" />
            <div>
              <span className="text-[#FFB800] text-xs font-bold">QUICK TRAVEL</span>
              <p className="text-[#6B7280] text-[10px]">Tap city buttons right on the Market screen to fly instantly.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 game-panel p-2">
            <MapPin size={16} className="text-[#00FF41]" />
            <div>
              <span className="text-[#00FF41] text-xs font-bold">TRAVEL TAB</span>
              <p className="text-[#6B7280] text-[10px]">See all cities with police risk and volatility info.</p>
            </div>
          </div>
        </div>
        <div className="game-panel p-3">
          <p className="text-[#FF0055] font-pixel text-xs mb-1">COST OF TRAVEL</p>
          <ul className="text-[#E0E0E0] text-xs space-y-1">
            <li>- Each flight costs money (shown on button)</li>
            <li>- Advances 1 week (same as END WEEK)</li>
            <li>- 10% debt interest applies</li>
            <li>- Random events can trigger mid-flight!</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: 'RANDOM EVENTS',
    color: '#FF0055',
    content: (
      <div className="space-y-3">
        <p className="text-[#E0E0E0] text-sm text-center">Every time you travel or end a week, random things can happen.</p>
        <div className="space-y-2">
          <div className="flex items-center gap-3 game-panel-red p-2">
            <img src="/cop.png" alt="cop" className="w-8 h-8" />
            <div>
              <span className="text-[#FF0055] text-xs font-bold">POLICE STOP</span>
              <p className="text-[#6B7280] text-[10px]">Fight, bribe ($5,000), or flee. Each has different risks.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 game-panel-red p-2">
            <img src="/mugger.png" alt="mugger" className="w-8 h-8" />
            <div>
              <span className="text-[#FF0055] text-xs font-bold">MUGGED</span>
              <p className="text-[#6B7280] text-[10px]">Fight back, pay up, or try to run away.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 border border-[#FF66AA]/30 p-2 rounded bg-[#FF66AA]/5">
            <img src="/old-lady.png" alt="old lady" className="w-8 h-8" />
            <div>
              <span className="text-[#FF66AA] text-xs font-bold">VISIT YOUR OLD LADY</span>
              <p className="text-[#6B7280] text-[10px]">Spend time with her (+25 health, -$500) or keep hustling (-10 health).</p>
            </div>
          </div>
          <div className="flex items-center gap-3 game-panel p-2">
            <AlertTriangle size={16} className="text-[#FFB800]" />
            <div>
              <span className="text-[#FFB800] text-xs font-bold">MARKET CRASH / BOOM</span>
              <p className="text-[#6B7280] text-[10px]">Prices can suddenly crash or spike across the board.</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'THE LOAN SHARK',
    color: '#FF0055',
    content: (
      <div className="space-y-3">
        <div className="flex justify-center">
          <Skull size={40} className="text-[#FF0055]" />
        </div>
        <p className="text-[#E0E0E0] text-sm text-center">You start with <span className="text-[#FF0055] font-bold">$15,000 debt</span>. The Shark wants it back.</p>
        <div className="game-panel-red p-3 space-y-2">
          <p className="text-[#FF0055] font-pixel text-xs">HOW DEBT WORKS</p>
          <ul className="text-[#E0E0E0] text-xs space-y-1">
            <li>- Grows <span className="text-[#FFB800] font-bold">10% every week</span> (compound interest!)</li>
            <li>- Week 1: $15,000 {'->'} $16,500</li>
            <li>- Week 10: $15,000 {'->'} ~$38,900</li>
            <li>- Pay it off from the SHARK tab anytime</li>
          </ul>
        </div>
        <div className="game-panel p-3 border-[#FF0055]/50">
          <p className="text-[#FF0055] font-bold text-xs">GAME OVER if you reach week 30 with unpaid debt!</p>
        </div>
        <div className="game-panel p-3">
          <p className="text-[#00FF41] font-pixel text-xs mb-1">STRATEGY</p>
          <p className="text-[#E0E0E0] text-xs">Pay down debt early! The longer you wait, the more the interest compounds. Balance investing in product vs paying the Shark.</p>
        </div>
      </div>
    ),
  },
  {
    title: 'DEALER TYPES',
    color: '#00FF41',
    content: (
      <div className="space-y-3">
        <p className="text-[#E0E0E0] text-sm text-center">Before starting, pick a dealer. Each has a unique perk.</p>
        <div className="space-y-2">
          <div className="game-panel p-2">
            <span className="text-[#00FF41] text-xs font-bold">FAST HANDS</span>
            <p className="text-[#6B7280] text-[10px]">+20 inventory space. Carry more product per trip.</p>
          </div>
          <div className="game-panel p-2">
            <span className="text-[#FF0055] text-xs font-bold">IRON SKIN</span>
            <p className="text-[#6B7280] text-[10px]">+50 max health. Survive fights and events easier.</p>
          </div>
          <div className="game-panel p-2">
            <span className="text-[#FFB800] text-xs font-bold">SHARPSHOOTER</span>
            <p className="text-[#6B7280] text-[10px]">+15 weapon damage. Win fights with less injury.</p>
          </div>
          <div className="game-panel p-2">
            <span className="text-[#00CCFF] text-xs font-bold">CONNECTED</span>
            <p className="text-[#6B7280] text-[10px]">Fewer police encounters. Fly under the radar.</p>
          </div>
          <div className="game-panel p-2">
            <span className="text-[#00CC66] text-xs font-bold">LUCKY</span>
            <p className="text-[#6B7280] text-[10px]">Better market prices. Buy cheaper, sell higher.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'TIPS TO WIN',
    color: '#FFB800',
    content: (
      <div className="space-y-3">
        <div className="game-panel p-3">
          <p className="text-[#00FF41] font-pixel text-xs mb-2">EARLY GAME (Weeks 1-10)</p>
          <ul className="text-[#E0E0E0] text-xs space-y-1">
            <li>- Focus on cheap products: Weed, Shrooms, Acid</li>
            <li>- Build up your cash reserves fast</li>
            <li>- Pay down some debt early to stop interest</li>
            <li>- End week frequently to find good prices</li>
          </ul>
        </div>
        <div className="game-panel p-3">
          <p className="text-[#FFB800] font-pixel text-xs mb-2">MID GAME (Weeks 10-20)</p>
          <ul className="text-[#E0E0E0] text-xs space-y-1">
            <li>- Move into Speed and Heroin for bigger margins</li>
            <li>- Start traveling to chase price spikes</li>
            <li>- Keep a mix of products, don't go all-in on one</li>
            <li>- Pay off more debt before it balloons</li>
          </ul>
        </div>
        <div className="game-panel p-3">
          <p className="text-[#FF0055] font-pixel text-xs mb-2">LATE GAME (Weeks 20-30)</p>
          <ul className="text-[#E0E0E0] text-xs space-y-1">
            <li>- COKE has the biggest profit but takes 2x space</li>
            <li>- Debt is massive now — prioritize paying it off</li>
            <li>- Keep cash reserves for the final debt payment</li>
            <li>- Don't die! Bribe cops rather than fight</li>
          </ul>
        </div>
        <div className="flex justify-center mt-2">
          <Trophy size={32} className="text-[#FFB800]" />
        </div>
      </div>
    ),
  },
];

export function TutorialSlideshow({ onClose }: TutorialSlideshowProps) {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent(c => Math.min(c + 1, slides.length - 1));
  const prev = () => setCurrent(c => Math.max(c - 1, 0));

  return (
    <motion.div
      className="absolute inset-0 z-50 bg-[#1A1C23]/98 backdrop-blur-md flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#333]">
        <div className="flex items-center gap-2">
          <Info size={18} style={{ color: slides[current].color }} />
          <span className="font-pixel text-xs" style={{ color: slides[current].color }}>
            HOW TO PLAY
          </span>
          <span className="text-[#6B7280] text-xs">{current + 1} / {slides.length}</span>
        </div>
        <button onClick={onClose} className="text-[#6B7280] hover:text-[#FF0055] transition-colors p-1">
          <X size={20} />
        </button>
      </div>

      {/* Slide Content */}
      <div className="flex-1 overflow-y-auto scroll-hide p-4 flex items-start justify-center">
        <div className="w-full max-w-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
            >
              <h2
                className="font-pixel text-sm text-center mb-4"
                style={{ color: slides[current].color, textShadow: `0 0 10px ${slides[current].color}40` }}
              >
                {slides[current].title}
              </h2>
              {slides[current].content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 border-t border-[#333]">
        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mb-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                backgroundColor: i === current ? slides[current].color : '#333',
                transform: i === current ? 'scale(1.3)' : 'scale(1)',
              }}
            />
          ))}
        </div>

        {/* Prev/Next buttons */}
        <div className="flex gap-2">
          <button
            onClick={prev}
            disabled={current === 0}
            className="btn-neon flex-1 py-2 text-sm flex items-center justify-center gap-1 disabled:opacity-30"
          >
            <ChevronLeft size={16} />
            BACK
          </button>
          {current === slides.length - 1 ? (
            <button
              onClick={onClose}
              className="btn-neon-gold flex-1 py-2 text-sm flex items-center justify-center gap-1"
            >
              GOT IT!
            </button>
          ) : (
            <button
              onClick={next}
              className="btn-neon flex-1 py-2 text-sm flex items-center justify-center gap-1"
            >
              NEXT
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
