import { useState } from 'react';
import { useGameStore, CITIES, DRUGS } from '@/store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plane, DollarSign, Heart, Package, MapPin,
  TrendingUp, TrendingDown, Skull,
  ChevronUp, ChevronDown, Clock, Info,
  Plus, Minus, HelpCircle
} from 'lucide-react';

type TabType = 'market' | 'inventory' | 'travel' | 'shark';

interface GameScreenProps {
  onShowTutorial: () => void;
}

export function GameScreen({ onShowTutorial }: GameScreenProps) {
  const state = useGameStore();
  const [activeTab, setActiveTab] = useState<TabType>('market');
  const [showTravelConfirm, setShowTravelConfirm] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState(1000);
  const [showHelp, setShowHelp] = useState(false);
  const [showEndWeekConfirm, setShowEndWeekConfirm] = useState(false);

  const currentCity = CITIES.find(c => c.id === state.currentCity);
  const usedSpace = state.inventory.reduce((sum, item) => {
    const d = DRUGS.find(dd => dd.id === item.drugId);
    return sum + item.quantity * (d?.spacePerUnit || 1);
  }, 0);
  const healthPercent = (state.playerStats.health / state.playerStats.maxHealth) * 100;

  const buyDrug = (drugId: string, qty: number) => state.buyDrug(drugId, qty);
  const sellDrug = (drugId: string, qty: number) => state.sellDrug(drugId, qty);
  const buyMax = (drugId: string) => state.buyMax(drugId);
  const sellMax = (drugId: string) => state.sellMax(drugId);

  const handleTravel = (cityId: string) => {
    if (cityId === state.currentCity) {
      setShowTravelConfirm(null);
      return;
    }
    const city = CITIES.find(c => c.id === cityId);
    if (!city || state.cash < city.travelCost) return;
    state.travelTo(cityId);
    setShowTravelConfirm(null);
    setActiveTab('market');
  };

  const handleEndWeek = () => {
    state.advanceWeek();
    setShowEndWeekConfirm(false);
  };

  const handlePayDebt = () => state.payDebt(payAmount);
  const handlePayAllDebt = () => state.payDebt(state.debt);

  const otherCities = CITIES.filter(c => c.id !== state.currentCity && state.citiesUnlocked.includes(c.id));

  return (
    <div className={`relative w-full h-full flex flex-col ${state.isTraveling ? 'animate-shake' : ''}`}>
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: 'url(/city-bg.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1C23]/95 via-[#1A1C23]/98 to-[#1A1C23]/95" />

      {/* HUD */}
      <div className="relative z-20 bg-[#1A1C23]/95 border-b-2 border-[#00FF41]/50 px-3 py-2">
        {/* Top row: City + Week */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-[#FFB800]" />
            <span className="text-[#FFB800] font-bold text-sm">{currentCity?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onShowTutorial}
              className="text-[#00CCFF] hover:text-[#00FF41] transition-colors p-1"
              title="How to Play"
            >
              <HelpCircle size={16} />
            </button>
            <button onClick={() => setShowHelp(!showHelp)} className="text-[#6B7280] hover:text-[#00FF41] transition-colors p-1">
              <Info size={16} />
            </button>
            <span className="text-[#00FF41] font-pixel text-xs">
              WK {state.currentWeek}/{state.maxWeeks}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <DollarSign size={14} className="text-[#00FF41]" />
              <span className="text-[#00FF41] font-mono-pixel text-lg font-bold">
                ${state.cash.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Skull size={14} className="text-[#FF0055]" />
              <span className="text-[#FF0055] font-mono-pixel text-sm">
                ${state.debt.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Heart size={14} className={healthPercent > 50 ? 'text-[#FF0055]' : 'text-[#FF4444]'} />
              <div className="w-16 h-2 bg-[#333] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${healthPercent}%`,
                    backgroundColor: healthPercent > 50 ? '#FF0055' : '#FF4444',
                  }}
                />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Package size={14} className="text-[#00FF41]" />
              <span className="text-[#00FF41] text-xs font-mono-pixel">
                {usedSpace}/{state.playerStats.inventorySpace}
              </span>
            </div>
          </div>
        </div>

        {/* Help tooltip */}
        <AnimatePresence>
          {showHelp && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 p-2 bg-[#252833] rounded border border-[#00FF41]/30 text-xs text-[#E0E0E0] space-y-1">
                <p><span className="text-[#00FF41] font-bold">BUY MAX</span> = Buy all you can afford/carry</p>
                <p><span className="text-[#FFB800] font-bold">SELL ALL</span> = Sell entire stock of that product</p>
                <p><span className="text-[#00CCFF] font-bold">END WEEK</span> = Advance time, new prices, debt grows</p>
                <p><span className="text-[#FF66AA] font-bold">TRAVEL</span> = Fly to another city (costs $, advances week)</p>
                <p className="text-[#6B7280]">Tip: Buy low, sell high. Watch the profit % indicators!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* END WEEK Banner - Always visible */}
      <div className="relative z-20 px-3 pt-2">
        {!showEndWeekConfirm ? (
          <button
            onClick={() => setShowEndWeekConfirm(true)}
            className="w-full btn-neon py-3 flex items-center justify-center gap-2 text-base animate-pulse-glow"
          >
            <Clock size={18} />
            END WEEK
            <span className="text-[#6B7280] text-xs font-normal">(advances time, new prices)</span>
          </button>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="game-panel p-3"
          >
            <p className="text-[#FFB800] text-sm font-bold text-center">End Week {state.currentWeek}?</p>
            <p className="text-[#6B7280] text-xs text-center mt-1">
              Debt interest: +${Math.round(state.debt * 0.1).toLocaleString()} | Living: $200
            </p>
            <div className="flex gap-2 mt-2">
              <button onClick={handleEndWeek} className="btn-neon flex-1 py-2 text-sm">
                CONFIRM
              </button>
              <button onClick={() => setShowEndWeekConfirm(false)} className="btn-neon-red flex-1 py-2 text-sm">
                CANCEL
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick Travel Row - Show other cities directly on market tab */}
      {activeTab === 'market' && !showEndWeekConfirm && (
        <div className="relative z-20 px-3 pt-2">
          <div className="flex items-center gap-2 overflow-x-auto scroll-hide pb-1">
            <span className="text-[#6B7280] text-xs whitespace-nowrap flex items-center gap-1">
              <Plane size={12} /> QUICK TRAVEL:
            </span>
            {otherCities.length === 0 ? (
              <span className="text-[#6B7280] text-xs">No other cities unlocked yet</span>
            ) : (
              otherCities.map(city => {
                const canAfford = state.cash >= city.travelCost;
                return (
                  <button
                    key={city.id}
                    onClick={() => canAfford && setShowTravelConfirm(city.id)}
                    disabled={!canAfford}
                    className={`whitespace-nowrap px-3 py-1 rounded text-xs font-bold border transition-all ${
                      canAfford
                        ? 'border-[#FFB800]/50 text-[#FFB800] hover:bg-[#FFB800]/10 hover:border-[#FFB800]'
                        : 'border-[#333] text-[#6B7280] opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {city.name} (${city.travelCost.toLocaleString()})
                  </button>
                );
              })
            )}
            <button
              onClick={() => setActiveTab('travel')}
              className="whitespace-nowrap px-3 py-1 rounded text-xs font-bold border border-[#00FF41]/30 text-[#00FF41] hover:bg-[#00FF41]/10"
            >
              VIEW ALL...
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 overflow-y-auto scroll-hide p-3">
        <AnimatePresence mode="wait">
          {activeTab === 'market' && (
            <motion.div
              key="market"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-2"
            >
              {DRUGS.map(drug => {
                const priceEntry = state.marketPrices.find(p => p.drugId === drug.id);
                const invItem = state.inventory.find(i => i.drugId === drug.id);
                const price = priceEntry?.price || 0;
                const avgPrice = invItem?.avgBuyPrice || 0;
                const profitPercent = avgPrice > 0 ? Math.round(((price - avgPrice) / avgPrice) * 100) : 0;

                return (
                  <DrugCard
                    key={drug.id}
                    drug={drug}
                    price={price}
                    quantity={invItem?.quantity || 0}
                    profitPercent={profitPercent}
                    onBuyCustom={(qty) => buyDrug(drug.id, qty)}
                    onSellCustom={(qty) => sellDrug(drug.id, qty)}
                    onBuyMax={() => buyMax(drug.id)}
                    onSellMax={() => sellMax(drug.id)}
                    canBuy={state.cash >= price && usedSpace < state.playerStats.inventorySpace}
                    canSell={(invItem?.quantity || 0) > 0}
                    maxBuyable={Math.min(
                      Math.floor((state.playerStats.inventorySpace - usedSpace) / drug.spacePerUnit),
                      Math.floor(state.cash / (price || 1))
                    )}
                  />
                );
              })}
            </motion.div>
          )}

          {activeTab === 'inventory' && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-2"
            >
              <div className="game-panel p-3 mb-3">
                <h3 className="text-[#00FF41] font-pixel text-xs mb-2">INVENTORY STATUS</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Space Used:</span>
                  <span className="text-[#00FF41]">{usedSpace} / {state.playerStats.inventorySpace}</span>
                </div>
                <div className="w-full h-2 bg-[#333] rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-[#00FF41] rounded-full transition-all"
                    style={{ width: `${(usedSpace / state.playerStats.inventorySpace) * 100}%` }}
                  />
                </div>
              </div>

              {state.inventory.filter(i => i.quantity > 0).map(item => {
                const drug = DRUGS.find(d => d.id === item.drugId);
                const priceEntry = state.marketPrices.find(p => p.drugId === item.drugId);
                if (!drug) return null;
                const currentPrice = priceEntry?.price || 0;
                const totalValue = item.quantity * currentPrice;
                const totalCost = item.quantity * item.avgBuyPrice;
                const totalProfit = totalValue - totalCost;

                return (
                  <div key={item.drugId} className="game-panel p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#1A1C23] rounded border border-[#333] flex items-center justify-center overflow-hidden">
                        {drug.id === 'coke' ? (
                          <div className="w-6 h-6 bg-white/80 rounded-sm" />
                        ) : (
                          <img src={drug.icon} alt={drug.name} className="w-8 h-8 object-contain" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[#E0E0E0] font-bold text-sm">{drug.name}</span>
                          <span className="text-[#00FF41] font-mono-pixel text-sm">{item.quantity} units</span>
                        </div>
                        <div className="flex items-center justify-between text-xs mt-1">
                          <span className="text-[#6B7280]">Avg Buy: ${item.avgBuyPrice.toLocaleString()}</span>
                          <span className="text-[#FFB800]">Current: ${currentPrice.toLocaleString()}</span>
                        </div>
                        <div className={`text-xs mt-1 ${totalProfit >= 0 ? 'text-[#00CC66]' : 'text-[#FF4444]'}`}>
                          Total: ${totalValue.toLocaleString()} ({totalProfit >= 0 ? '+' : ''}${totalProfit.toLocaleString()})
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {state.inventory.filter(i => i.quantity > 0).length === 0 && (
                <div className="text-center py-8 text-[#6B7280]">
                  <Package size={48} className="mx-auto mb-2 opacity-30" />
                  <p>Your inventory is empty.</p>
                  <p className="text-sm mt-1">Buy some products from the market!</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'travel' && (
            <motion.div
              key="travel"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-2"
            >
              <div className="game-panel p-3 mb-3">
                <h3 className="text-[#FFB800] font-pixel text-xs mb-1">TRAVEL</h3>
                <p className="text-[#6B7280] text-xs">Pick a city to fly to. Each flight advances 1 week, applies 10% debt interest, and may trigger random events. You cannot travel to your current city.</p>
              </div>

              {/* Current city indicator */}
              <div className="border border-[#00FF41]/50 bg-[#00FF41]/5 p-3 rounded">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#00FF41]" />
                  <span className="text-[#00FF41] font-bold text-sm">YOU ARE HERE: {currentCity?.name}</span>
                </div>
              </div>

              {CITIES.map(city => {
                const isCurrent = city.id === state.currentCity;
                const canAfford = state.cash >= city.travelCost;
                const isUnlocked = state.citiesUnlocked.includes(city.id);

                return (
                  <div key={city.id}>
                    <button
                      onClick={() => {
                        if (isCurrent) return;
                        setShowTravelConfirm(city.id);
                      }}
                      disabled={isCurrent || !canAfford || !isUnlocked}
                      className={`w-full p-3 text-left transition-all rounded ${
                        isCurrent
                          ? 'border border-[#00FF41]/50 bg-[#00FF41]/5 opacity-60'
                          : canAfford && isUnlocked
                            ? 'game-panel hover:shadow-[0_0_15px_rgba(0,255,65,0.3)]'
                            : 'border border-[#333] bg-[#252833]/30 opacity-40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Plane size={16} className={isCurrent ? 'text-[#00FF41]' : canAfford ? 'text-[#FFB800]' : 'text-[#FF4444]'} />
                          <span className={`font-bold text-sm ${isCurrent ? 'text-[#00FF41]' : 'text-[#E0E0E0]'}`}>
                            {city.name}
                          </span>
                          {isCurrent && <span className="text-[10px] bg-[#00FF41]/20 text-[#00FF41] px-1.5 py-0.5">HERE</span>}
                          {!isUnlocked && <span className="text-[10px] bg-[#333] text-[#6B7280] px-1.5 py-0.5">LOCKED</span>}
                        </div>
                        <span className={`font-mono-pixel text-sm ${canAfford ? 'text-[#FFB800]' : 'text-[#FF4444]'}`}>
                          ${city.travelCost.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[#6B7280]">
                        <span>Police: {Math.round(city.policeChance * 100)}%</span>
                        <span>Volatility: {Math.round(city.volatility * 100)}%</span>
                        <span>{city.maxWeeks} weeks</span>
                      </div>
                    </button>

                    <AnimatePresence>
                      {showTravelConfirm === city.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="game-panel p-3 mt-1">
                            <p className="text-[#FFB800] text-sm font-bold">Fly to {city.name}?</p>
                            <p className="text-[#6B7280] text-xs mt-1">
                              Cost: <span className="text-[#FF4444]">${city.travelCost.toLocaleString()}</span> | 
                              Week: <span className="text-[#00FF41]">{state.currentWeek + 1}/{state.maxWeeks}</span> |
                              Debt interest will apply
                            </p>
                            <div className="flex gap-2 mt-2">
                              <button onClick={() => handleTravel(city.id)} className="btn-neon-gold flex-1 py-2 text-sm">
                                <Plane size={14} className="inline mr-1" />
                                FLY
                              </button>
                              <button onClick={() => setShowTravelConfirm(null)} className="btn-neon flex-1 py-2 text-sm">
                                CANCEL
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'shark' && (
            <motion.div
              key="shark"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              <div className="game-panel-red p-4">
                <h3 className="text-[#FF0055] font-pixel text-sm mb-2 flex items-center gap-2">
                  <Skull size={16} />
                  THE LOAN SHARK
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Current Debt:</span>
                    <span className="text-[#FF0055] font-mono-pixel text-xl">${state.debt.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Interest Rate:</span>
                    <span className="text-[#FFB800]">10% per week</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Next Interest:</span>
                    <span className="text-[#FF4444]">+${Math.round(state.debt * 0.1).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="game-panel p-4">
                <h3 className="text-[#00FF41] font-pixel text-xs mb-3">PAY DEBT</h3>
                <div className="flex items-center gap-2 mb-3">
                  <button onClick={() => setPayAmount(Math.max(100, payAmount - 1000))} className="btn-neon p-1">
                    <ChevronDown size={16} />
                  </button>
                  <span className="text-[#E0E0E0] font-mono-pixel text-lg flex-1 text-center">
                    ${payAmount.toLocaleString()}
                  </span>
                  <button onClick={() => setPayAmount(Math.min(state.cash, payAmount + 1000))} className="btn-neon p-1">
                    <ChevronUp size={16} />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button onClick={handlePayDebt} disabled={payAmount <= 0 || state.cash < payAmount || state.debt <= 0} className="btn-neon flex-1 py-2 text-sm disabled:opacity-30">
                    PAY ${payAmount.toLocaleString()}
                  </button>
                  <button onClick={handlePayAllDebt} disabled={state.cash <= 0 || state.debt <= 0} className="btn-neon-red flex-1 py-2 text-sm disabled:opacity-30">
                    PAY ALL
                  </button>
                </div>
              </div>

              <div className="game-panel p-3">
                <h3 className="text-[#FFB800] font-pixel text-xs mb-2">DEBT TIPS</h3>
                <ul className="text-[#6B7280] text-xs space-y-1">
                  <li>- Pay off your debt before the final week or GAME OVER</li>
                  <li>- Interest compounds weekly at 10%</li>
                  <li>- The Shark takes inventory if debt is too high (Detroit+)</li>
                  <li>- Prioritize debt payment in later weeks</li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Tab Bar */}
      <div className="relative z-20 bg-[#1A1C23]/95 border-t-2 border-[#00FF41]/50 px-2 py-1">
        <div className="flex items-center justify-around">
          <TabButton active={activeTab === 'market'} onClick={() => setActiveTab('market')} icon={<TrendingUp size={18} />} label="MARKET" />
          <TabButton active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} icon={<Package size={18} />} label="BAG" />
          <TabButton active={activeTab === 'travel'} onClick={() => setActiveTab('travel')} icon={<Plane size={18} />} label="TRAVEL" />
          <TabButton active={activeTab === 'shark'} onClick={() => setActiveTab('shark')} icon={<Skull size={18} />} label="SHARK" />
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded transition-all ${
        active ? 'text-[#00FF41] bg-[#00FF41]/10' : 'text-[#6B7280] hover:text-[#E0E0E0]'
      }`}
    >
      {icon}
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}

function DrugCard({ drug, price, quantity, profitPercent, onBuyCustom, onSellCustom, onBuyMax, onSellMax, canBuy, canSell, maxBuyable }: {
  drug: typeof DRUGS[0]; price: number; quantity: number; profitPercent: number;
  onBuyCustom: (qty: number) => void; onSellCustom: (qty: number) => void;
  onBuyMax: () => void; onSellMax: () => void;
  canBuy: boolean; canSell: boolean; maxBuyable: number;
}) {
  const isProfit = profitPercent > 0;
  const isLoss = profitPercent < 0;
  const [buyQty, setBuyQty] = useState(1);
  const [sellQty, setSellQty] = useState(1);
  const [mode, setMode] = useState<'quick' | 'custom'>('quick');

  const clampBuy = (v: number) => Math.max(1, Math.min(v, maxBuyable));
  const clampSell = (v: number) => Math.max(1, Math.min(v, quantity));

  return (
    <motion.div layout className="game-panel p-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#1A1C23] rounded border border-[#333] flex items-center justify-center overflow-hidden flex-shrink-0">
          {drug.id === 'coke' ? (
            <div className="w-6 h-6 bg-white/80 rounded-sm border border-white/40" />
          ) : (
            <img src={drug.icon} alt={drug.name} className="w-10 h-10 object-contain" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[#E0E0E0] font-bold text-sm">{drug.name}</span>
            {quantity > 0 && <span className="text-[#00FF41] text-xs font-mono-pixel">{quantity} held</span>}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[#FFB800] font-mono-pixel text-lg font-bold">${price.toLocaleString()}</span>
            {isProfit && <span className="text-[#00CC66] text-xs flex items-center gap-0.5"><TrendingUp size={12} /> +{profitPercent}%</span>}
            {isLoss && <span className="text-[#FF4444] text-xs flex items-center gap-0.5"><TrendingDown size={12} /> {profitPercent}%</span>}
          </div>
          <span className="text-[#6B7280] text-[10px]">{drug.spacePerUnit} slot/unit</span>
        </div>

        {/* Mode toggle */}
        <div className="flex flex-col gap-1 items-end">
          <div className="flex gap-1 mb-1">
            <button
              onClick={() => setMode('quick')}
              className={`text-[9px] px-1.5 py-0.5 rounded border ${mode === 'quick' ? 'border-[#00FF41] text-[#00FF41]' : 'border-[#333] text-[#6B7280]'}`}
            >
              MAX
            </button>
            <button
              onClick={() => setMode('custom')}
              className={`text-[9px] px-1.5 py-0.5 rounded border ${mode === 'custom' ? 'border-[#FFB800] text-[#FFB800]' : 'border-[#333] text-[#6B7280]'}`}
            >
              QTY
            </button>
          </div>

          {mode === 'quick' ? (
            <>
              <button onClick={onBuyMax} disabled={!canBuy} className="btn-neon py-1.5 px-3 text-xs disabled:opacity-30">
                BUY MAX
              </button>
              <button onClick={onSellMax} disabled={!canSell} className="btn-neon-gold py-1.5 px-3 text-xs disabled:opacity-30">
                SELL ALL
              </button>
            </>
          ) : (
            <>
              {/* Buy with quantity */}
              <div className="flex items-center gap-1">
                <button onClick={() => setBuyQty(q => clampBuy(q - 1))} disabled={!canBuy || buyQty <= 1} className="p-1 text-[#00FF41] disabled:opacity-30">
                  <Minus size={12} />
                </button>
                <span className="text-[#E0E0E0] font-mono-pixel text-xs w-6 text-center">{buyQty}</span>
                <button onClick={() => setBuyQty(q => clampBuy(q + 1))} disabled={!canBuy || buyQty >= maxBuyable} className="p-1 text-[#00FF41] disabled:opacity-30">
                  <Plus size={12} />
                </button>
                <button
                  onClick={() => onBuyCustom(buyQty)}
                  disabled={!canBuy || buyQty <= 0}
                  className="btn-neon py-1 px-2 text-[10px] ml-1 disabled:opacity-30"
                >
                  BUY
                </button>
              </div>
              {/* Sell with quantity */}
              <div className="flex items-center gap-1">
                <button onClick={() => setSellQty(q => clampSell(q - 1))} disabled={!canSell || sellQty <= 1} className="p-1 text-[#FFB800] disabled:opacity-30">
                  <Minus size={12} />
                </button>
                <span className="text-[#E0E0E0] font-mono-pixel text-xs w-6 text-center">{sellQty}</span>
                <button onClick={() => setSellQty(q => clampSell(q + 1))} disabled={!canSell || sellQty >= quantity} className="p-1 text-[#FFB800] disabled:opacity-30">
                  <Plus size={12} />
                </button>
                <button
                  onClick={() => onSellCustom(sellQty)}
                  disabled={!canSell || sellQty <= 0}
                  className="btn-neon-gold py-1 px-2 text-[10px] ml-1 disabled:opacity-30"
                >
                  SELL
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
