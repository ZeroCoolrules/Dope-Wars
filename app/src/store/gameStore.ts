import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameState, GameScreen, City, Drug, InventoryItem, MarketPrice,
  RandomEvent, LeaderboardEntry
} from '@/types/game';
import { DRUGS, CITIES, EVENTS, DEALERS } from '@/types/game';

function generatePrice(drug: Drug, city: City, dealerId: string | null): number {
  const base = drug.basePrice;
  const volatility = city.volatility;
  const randomFactor = 0.5 + Math.random() * volatility * 2;
  let price = Math.round(base * randomFactor);
  price = Math.max(drug.minPrice, Math.min(drug.maxPrice, price));
  if (dealerId === 'lucky') {
    price = Math.round(price * 0.95);
  }
  return price;
}

function generateMarketPrices(city: City, dealerId: string | null): MarketPrice[] {
  return DRUGS.map(drug => ({
    drugId: drug.id,
    price: generatePrice(drug, city, dealerId),
  }));
}

function getRandomEvent(city: City, heat: number): RandomEvent | null {
  const policeChance = city.policeChance + heat * 0.05;
  const roll = Math.random();
  // Old lady event - special, lower chance, non-violent
  if (roll < 0.08) {
    return EVENTS.find(e => e.id === 'old_lady') || null;
  }
  if (roll < policeChance * 0.4 + 0.08) {
    return EVENTS.find(e => e.id === 'cop_stop') || null;
  }
  if (roll < policeChance * 0.7 + 0.08) {
    return EVENTS.find(e => e.id === 'mugger') || null;
  }
  if (roll < policeChance * 0.85 + 0.08) {
    const randomEvents = EVENTS.filter(e => e.type === 'market_crash' || e.type === 'market_boom' || e.type === 'seizure');
    return randomEvents[Math.floor(Math.random() * randomEvents.length)] || null;
  }
  if (roll < policeChance + 0.08) {
    const tipEvent = EVENTS.find(e => e.id === 'tip');
    if (tipEvent) return { ...tipEvent, description: `A contact whispers: "${getRandomTip()}"` };
  }
  return null;
}

function getRandomTip(): string {
  const tips = [
    'Coke prices are about to explode in Manhattan!',
    'Weed is dirt cheap in Brooklyn right now.',
    'The cops are cracking down on heroin this week.',
    'Acid is going for triple in Miami next week.',
    'Speed demand is skyrocketing in LA.',
    'Shrooms are rare after that drought. Prices will spike.',
  ];
  return tips[Math.floor(Math.random() * tips.length)];
}

interface GameActions {
  setScreen: (screen: GameScreen) => void;
  selectLevel: (cityId: string) => void;
  selectDealer: (dealerId: string) => void;
  startGame: () => void;
  buyDrug: (drugId: string, quantity: number) => void;
  sellDrug: (drugId: string, quantity: number) => void;
  buyMax: (drugId: string) => void;
  sellMax: (drugId: string) => void;
  travelTo: (cityId: string) => void;
  payDebt: (amount: number) => void;
  resolveEvent: (choiceId?: string) => void;
  advanceWeek: () => void;
  addFloatingText: (text: string, x: number, y: number, color: string) => void;
  removeFloatingText: (id: string) => void;
  addMessage: (msg: string) => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  resetProgress: () => void;
  loadGame: () => void;
  saveHighScore: (name: string) => void;
}

const initialInventory: InventoryItem[] = DRUGS.map(d => ({ drugId: d.id, quantity: 0, avgBuyPrice: 0 }));

const createInitialState = (): GameState => ({
  screen: 'menu',
  currentCity: 'bronx',
  currentWeek: 1,
  maxWeeks: 30,
  cash: 10000,
  debt: 15000,
  inventory: initialInventory,
  marketPrices: [],
  playerStats: { inventorySpace: 100, health: 100, maxHealth: 100, armor: 0, weaponDamage: 10 },
  selectedDealer: null,
  selectedLevel: null,
  heat: 0,
  currentEvent: null,
  floatingTexts: [],
  leaderboard: [],
  soundEnabled: true,
  musicEnabled: true,
  citiesUnlocked: ['bronx', 'brooklyn', 'manhattan', 'jersey', 'miami', 'la', 'chicago', 'detroit', 'tijuana', 'cartagena'],
  isTraveling: false,
  travelDestination: null,
  messageLog: ['Welcome to the underground...'],
  gameWon: false,
});

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      setScreen: (screen) => set({ screen }),

      selectLevel: (cityId) => {
        set({ selectedLevel: cityId });
      },

      selectDealer: (dealerId) => {
        const dealer = DEALERS.find(d => d.id === dealerId);
        if (!dealer) return;
        const currentStats = get().playerStats;
        const newStats = { ...currentStats };
        if (dealer.bonus.inventorySpace) newStats.inventorySpace += dealer.bonus.inventorySpace;
        if (dealer.bonus.maxHealth) {
          newStats.maxHealth += dealer.bonus.maxHealth;
          newStats.health += dealer.bonus.health || dealer.bonus.maxHealth;
        }
        if (dealer.bonus.weaponDamage) newStats.weaponDamage += dealer.bonus.weaponDamage;
        set({ selectedDealer: dealerId, playerStats: newStats });
      },

      startGame: () => {
        const state = get();
        const city = CITIES.find(c => c.id === state.selectedLevel) || CITIES[0];
        const prices = generateMarketPrices(city, state.selectedDealer);
        set({
          screen: 'playing',
          currentCity: city.id,
          currentWeek: 1,
          maxWeeks: city.maxWeeks,
          cash: city.startCash,
          debt: city.startingDebt,
          inventory: DRUGS.map(d => ({ drugId: d.id, quantity: 0, avgBuyPrice: 0 })),
          marketPrices: prices,
          heat: 0,
          currentEvent: null,
          isTraveling: false,
          travelDestination: null,
          messageLog: [`Arrived in ${city.name}. Week 1 of ${city.maxWeeks}. The game begins...`],
          gameWon: false,
        });
      },

      buyDrug: (drugId, quantity) => {
        const state = get();
        const drug = DRUGS.find(d => d.id === drugId);
        const priceEntry = state.marketPrices.find(p => p.drugId === drugId);
        if (!drug || !priceEntry) return;
        const totalCost = priceEntry.price * quantity;
        const usedSpace = state.inventory.reduce((sum, item) => {
          const d = DRUGS.find(dd => dd.id === item.drugId);
          return sum + item.quantity * (d?.spacePerUnit || 1);
        }, 0);
        const availableSpace = state.playerStats.inventorySpace - usedSpace;
        const maxBuyable = Math.floor(availableSpace / drug.spacePerUnit);
        const actualQty = Math.min(quantity, maxBuyable, Math.floor(state.cash / priceEntry.price));
        if (actualQty <= 0 || totalCost > state.cash) return;
        const actualCost = actualQty * priceEntry.price;
        const newInventory = state.inventory.map(item => {
          if (item.drugId === drugId) {
            const totalQty = item.quantity + actualQty;
            const newAvg = totalQty > 0
              ? Math.round((item.avgBuyPrice * item.quantity + actualCost) / totalQty)
              : 0;
            return { ...item, quantity: totalQty, avgBuyPrice: newAvg };
          }
          return item;
        });
        set({
          cash: state.cash - actualCost,
          inventory: newInventory,
          messageLog: [`Bought ${actualQty} ${drug.name} for $${actualCost.toLocaleString()}`, ...state.messageLog.slice(0, 19)],
        });
      },

      sellDrug: (drugId, quantity) => {
        const state = get();
        const drug = DRUGS.find(d => d.id === drugId);
        const priceEntry = state.marketPrices.find(p => p.drugId === drugId);
        const invItem = state.inventory.find(i => i.drugId === drugId);
        if (!drug || !priceEntry || !invItem || invItem.quantity <= 0) return;
        const actualQty = Math.min(quantity, invItem.quantity);
        const revenue = actualQty * priceEntry.price;
        const profit = revenue - (actualQty * invItem.avgBuyPrice);
        const newInventory = state.inventory.map(item => {
          if (item.drugId === drugId) {
            return { ...item, quantity: Math.max(0, item.quantity - actualQty) };
          }
          return item;
        });
        const newHeat = state.heat + actualQty * 0.001;
        set({
          cash: state.cash + revenue,
          inventory: newInventory,
          heat: Math.min(newHeat, 1),
          messageLog: [
            `Sold ${actualQty} ${drug.name} for $${revenue.toLocaleString()} (${profit >= 0 ? '+' : ''}$${profit.toLocaleString()})`,
            ...state.messageLog.slice(0, 19)
          ],
        });
      },

      buyMax: (drugId) => {
        const state = get();
        const drug = DRUGS.find(d => d.id === drugId);
        const priceEntry = state.marketPrices.find(p => p.drugId === drugId);
        if (!drug || !priceEntry || priceEntry.price <= 0) return;
        const usedSpace = state.inventory.reduce((sum, item) => {
          const d = DRUGS.find(dd => dd.id === item.drugId);
          return sum + item.quantity * (d?.spacePerUnit || 1);
        }, 0);
        const availableSpace = state.playerStats.inventorySpace - usedSpace;
        const maxBySpace = Math.floor(availableSpace / drug.spacePerUnit);
        const maxByCash = Math.floor(state.cash / priceEntry.price);
        const maxQty = Math.min(maxBySpace, maxByCash);
        if (maxQty > 0) {
          get().buyDrug(drugId, maxQty);
        }
      },

      sellMax: (drugId) => {
        const state = get();
        const invItem = state.inventory.find(i => i.drugId === drugId);
        if (invItem && invItem.quantity > 0) {
          get().sellDrug(drugId, invItem.quantity);
        }
      },

      travelTo: (cityId) => {
        const state = get();
        const targetCity = CITIES.find(c => c.id === cityId);
        if (!targetCity || state.cash < targetCity.travelCost) return;
        set({
          cash: state.cash - targetCity.travelCost,
          isTraveling: true,
          travelDestination: cityId,
          messageLog: [`Flying to ${targetCity.name}...`, ...state.messageLog.slice(0, 19)],
        });
        setTimeout(() => {
          const s = get();
          const newCity = CITIES.find(c => c.id === cityId)!;
          const event = getRandomEvent(newCity, s.heat);
          const newWeek = s.currentWeek + 1;
          const newDebt = Math.round(s.debt * 1.1);
          if (event && (event.type === 'cop' || event.type === 'mugger')) {
            set({
              currentCity: cityId,
              currentWeek: newWeek,
              debt: newDebt,
              marketPrices: generateMarketPrices(newCity, s.selectedDealer),
              isTraveling: false,
              travelDestination: null,
              currentEvent: event,
              heat: Math.max(0, s.heat - 0.05),
              messageLog: [`Arrived in ${newCity.name}. Week ${newWeek}. ${event.title}!`, ...s.messageLog.slice(0, 19)],
            });
          } else if (event && event.autoEffect) {
            let newCash = s.cash;
            let newInventory = [...s.inventory];
            let newHealth = s.playerStats.health;
            if (event.type === 'seizure' && event.autoEffect.inventoryLoss) {
              const randomDrugIdx = Math.floor(Math.random() * DRUGS.length);
              const drugToLose = DRUGS[randomDrugIdx];
              newInventory = newInventory.map(item => {
                if (item.drugId === drugToLose.id) {
                  return { ...item, quantity: Math.floor(item.quantity * 0.7) };
                }
                return item;
              });
            }
            if (event.type === 'market_crash') {
              get().addMessage('PRICE CRASH! Prices have plummeted!');
            }
            if (event.type === 'market_boom') {
              get().addMessage('PRICE BOOM! Prices have skyrocketed!');
            }
            set({
              currentCity: cityId,
              currentWeek: newWeek,
              debt: newDebt,
              cash: newCash,
              inventory: newInventory,
              marketPrices: generateMarketPrices(newCity, s.selectedDealer),
              isTraveling: false,
              travelDestination: null,
              currentEvent: null,
              playerStats: { ...s.playerStats, health: newHealth },
              heat: Math.max(0, s.heat - 0.05),
              messageLog: [`Arrived in ${newCity.name}. Week ${newWeek}.`, ...s.messageLog.slice(0, 19)],
            });
          } else {
            set({
              currentCity: cityId,
              currentWeek: newWeek,
              debt: newDebt,
              marketPrices: generateMarketPrices(newCity, s.selectedDealer),
              isTraveling: false,
              travelDestination: null,
              currentEvent: event,
              heat: Math.max(0, s.heat - 0.05),
              messageLog: [`Arrived in ${newCity.name}. Week ${newWeek}.`, ...s.messageLog.slice(0, 19)],
            });
          }
          if (newWeek > s.maxWeeks) {
            const finalState = get();
            if (finalState.debt > 0 && finalState.cash < finalState.debt) {
              set({ screen: 'gameOver', gameWon: false });
            } else {
              if (finalState.debt > 0) {
                set({ cash: finalState.cash - finalState.debt, debt: 0 });
              }
              set({ screen: 'gameOver', gameWon: true });
            }
          }
        }, 1500);
      },

      payDebt: (amount) => {
        const state = get();
        const actualPay = Math.min(amount, state.cash, state.debt);
        if (actualPay <= 0) return;
        set({
          cash: state.cash - actualPay,
          debt: state.debt - actualPay,
          messageLog: [`Paid $${actualPay.toLocaleString()} to the Loan Shark. Debt: $${(state.debt - actualPay).toLocaleString()}`, ...state.messageLog.slice(0, 19)],
        });
      },

      resolveEvent: (choiceId) => {
        const state = get();
        if (!state.currentEvent) return;
        let newCash = state.cash;
        let newHealth = state.playerStats.health;
        let newInventory = [...state.inventory];
        if (state.currentEvent.choices && choiceId) {
          const choice = state.currentEvent.choices.find(c => c.id === choiceId);
          if (choice) {
            if (choice.effect.cashChange) newCash += choice.effect.cashChange;
            if (choice.effect.healthChange) newHealth += choice.effect.healthChange;
            if (choice.effect.debtChange) {
              set({ debt: state.debt + choice.effect.debtChange });
            }
          }
        } else if (state.currentEvent.autoEffect) {
          if (state.currentEvent.autoEffect.cashChange) newCash += state.currentEvent.autoEffect.cashChange;
          if (state.currentEvent.autoEffect.healthChange) newHealth += state.currentEvent.autoEffect.healthChange;
          if (state.currentEvent.autoEffect.inventoryLoss) {
            if (state.currentEvent.autoEffect.inventoryLoss.drugId === 'random') {
              const randomDrugIdx = Math.floor(Math.random() * DRUGS.length);
              const drugToLose = DRUGS[randomDrugIdx];
              newInventory = newInventory.map(item => {
                if (item.drugId === drugToLose.id) {
                  const loss = Math.floor(item.quantity * state.currentEvent!.autoEffect!.inventoryLoss!.percent);
                  return { ...item, quantity: Math.max(0, item.quantity - loss) };
                }
                return item;
              });
            }
          }
        }
        if (newHealth <= 0) {
          set({ screen: 'gameOver', gameWon: false, currentEvent: null });
          return;
        }
        set({
          cash: newCash,
          playerStats: { ...state.playerStats, health: newHealth },
          inventory: newInventory,
          currentEvent: null,
        });
      },

      advanceWeek: () => {
        const state = get();
        if (state.currentWeek >= state.maxWeeks) return;
        const newWeek = state.currentWeek + 1;
        const newDebt = Math.round(state.debt * 1.1);
        const livingExpense = 200;
        const newCash = Math.max(0, state.cash - livingExpense);
        const currentCityObj = CITIES.find(c => c.id === state.currentCity)!;
        set({
          currentWeek: newWeek,
          debt: newDebt,
          cash: newCash,
          marketPrices: generateMarketPrices(currentCityObj, state.selectedDealer),
          messageLog: [`Week ${newWeek}. Paid $${livingExpense} living expenses. Debt interest: $${newDebt - state.debt}`, ...state.messageLog.slice(0, 19)],
        });
        if (newWeek > state.maxWeeks) {
          const finalState = get();
          if (finalState.debt > 0 && finalState.cash < finalState.debt) {
            set({ screen: 'gameOver', gameWon: false });
          } else {
            if (finalState.debt > 0) {
              set({ cash: finalState.cash - finalState.debt, debt: 0 });
            }
            set({ screen: 'gameOver', gameWon: true });
          }
        }
      },

      addFloatingText: (text, x, y, color) => {
        const id = Math.random().toString(36).substr(2, 9);
        set(state => ({
          floatingTexts: [...state.floatingTexts, { id, text, x, y, color }],
        }));
        setTimeout(() => {
          set(state => ({
            floatingTexts: state.floatingTexts.filter(ft => ft.id !== id),
          }));
        }, 1000);
      },

      removeFloatingText: (id) => {
        set(state => ({
          floatingTexts: state.floatingTexts.filter(ft => ft.id !== id),
        }));
      },

      addMessage: (msg) => {
        set(state => ({
          messageLog: [msg, ...state.messageLog.slice(0, 19)],
        }));
      },

      toggleSound: () => set(state => ({ soundEnabled: !state.soundEnabled })),
      toggleMusic: () => set(state => ({ musicEnabled: !state.musicEnabled })),

      resetProgress: () => {
        set({
          citiesUnlocked: ['bronx', 'brooklyn', 'manhattan', 'jersey', 'miami', 'la', 'chicago', 'detroit', 'tijuana', 'cartagena'],
          leaderboard: [],
        });
      },

      loadGame: () => {
        const saved = localStorage.getItem('dope-wars-save');
        if (saved) {
          try {
            const data = JSON.parse(saved);
            set(data);
          } catch {
            // ignore
          }
        }
      },

      saveHighScore: (name) => {
        const state = get();
        const city = CITIES.find(c => c.id === state.currentCity);
        const netWorth = state.cash - state.debt + state.inventory.reduce((sum, item) => {
          const mp = state.marketPrices.find(p => p.drugId === item.drugId);
          return sum + item.quantity * (mp?.price || 0);
        }, 0);
        const profit = netWorth - (city?.startingDebt || 0);
        const entry: LeaderboardEntry = {
          name,
          score: netWorth,
          city: city?.name || 'Unknown',
          week: state.currentWeek,
          profit,
          date: new Date().toLocaleDateString(),
        };
        set(state => ({
          leaderboard: [...state.leaderboard, entry].sort((a, b) => b.score - a.score).slice(0, 50),
        }));
        if (state.selectedLevel && state.gameWon) {
          const cityIndex = CITIES.findIndex(c => c.id === state.selectedLevel);
          if (cityIndex >= 0 && cityIndex < CITIES.length - 1) {
            const nextCity = CITIES[cityIndex + 1].id;
            set(state => ({
              citiesUnlocked: state.citiesUnlocked.includes(nextCity)
                ? state.citiesUnlocked
                : [...state.citiesUnlocked, nextCity],
            }));
          }
        }
      },
    }),
    {
      name: 'dope-wars-save',
      partialize: (state) => ({
        leaderboard: state.leaderboard,
        citiesUnlocked: state.citiesUnlocked,
        soundEnabled: state.soundEnabled,
        musicEnabled: state.musicEnabled,
      }),
    }
  )
);

export { CITIES, DRUGS, DEALERS };
