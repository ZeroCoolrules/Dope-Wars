export type GameScreen = 'menu' | 'levelSelect' | 'playing' | 'gameOver' | 'leaderboard' | 'settings' | 'tutorial' | 'dealerSelect' | 'event';

export interface Drug {
  id: string;
  name: string;
  icon: string;
  basePrice: number;
  minPrice: number;
  maxPrice: number;
  spacePerUnit: number;
}

export interface City {
  id: string;
  name: string;
  description: string;
  travelCost: number;
  volatility: number;
  policeChance: number;
  unlocked: boolean;
  startingDebt: number;
  maxWeeks: number;
  startCash: number;
}

export interface InventoryItem {
  drugId: string;
  quantity: number;
  avgBuyPrice: number;
}

export interface MarketPrice {
  drugId: string;
  price: number;
}

export interface Dealer {
  id: string;
  name: string;
  description: string;
  perk: string;
  bonus: Partial<PlayerStats>;
}

export interface PlayerStats {
  inventorySpace: number;
  health: number;
  maxHealth: number;
  armor: number;
  weaponDamage: number;
}

export interface RandomEvent {
  id: string;
  type: 'cop' | 'mugger' | 'market_crash' | 'market_boom' | 'tip' | 'seizure' | 'rival' | 'old_lady' | 'none';
  title: string;
  description: string;
  image?: string;
  choices?: EventChoice[];
  autoEffect?: EventEffect;
}

export interface EventChoice {
  id: string;
  label: string;
  effect: EventEffect;
}

export interface EventEffect {
  cashChange?: number;
  healthChange?: number;
  inventoryLoss?: { drugId: string; percent: number };
  debtChange?: number;
  skipTurn?: boolean;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  city: string;
  week: number;
  profit: number;
  date: string;
}

export interface GameState {
  screen: GameScreen;
  currentCity: string;
  currentWeek: number;
  maxWeeks: number;
  cash: number;
  debt: number;
  inventory: InventoryItem[];
  marketPrices: MarketPrice[];
  playerStats: PlayerStats;
  selectedDealer: string | null;
  selectedLevel: string | null;
  heat: number;
  currentEvent: RandomEvent | null;
  floatingTexts: FloatingText[];
  leaderboard: LeaderboardEntry[];
  soundEnabled: boolean;
  musicEnabled: boolean;
  citiesUnlocked: string[];
  isTraveling: boolean;
  travelDestination: string | null;
  messageLog: string[];
  gameWon: boolean;
}

export const DRUGS: Drug[] = [
  { id: 'weed', name: 'WEED', icon: '/icon-weed.png', basePrice: 500, minPrice: 150, maxPrice: 1200, spacePerUnit: 1 },
  { id: 'acid', name: 'ACID', icon: '/icon-acid.png', basePrice: 1500, minPrice: 500, maxPrice: 3500, spacePerUnit: 1 },
  { id: 'shrooms', name: 'SHROOMS', icon: '/icon-shrooms.png', basePrice: 800, minPrice: 250, maxPrice: 2000, spacePerUnit: 1 },
  { id: 'speed', name: 'SPEED', icon: '/icon-speed.png', basePrice: 2000, minPrice: 600, maxPrice: 4500, spacePerUnit: 1 },
  { id: 'heroin', name: 'HEROIN', icon: '/icon-heroin.png', basePrice: 5000, minPrice: 1500, maxPrice: 12000, spacePerUnit: 1 },
  { id: 'coke', name: 'COKE', icon: '/icon-coke.png', basePrice: 15000, minPrice: 5000, maxPrice: 40000, spacePerUnit: 2 },
];

export const CITIES: City[] = [
  { id: 'bronx', name: 'THE BRONX', description: 'Where it all begins. Low heat, stable prices.', travelCost: 100, volatility: 0.3, policeChance: 0.05, unlocked: true, startingDebt: 15000, maxWeeks: 30, startCash: 10000 },
  { id: 'brooklyn', name: 'BROOKLYN', description: 'Prices swing wild here. Choose your dealer wisely.', travelCost: 150, volatility: 0.5, policeChance: 0.1, unlocked: true, startingDebt: 10000, maxWeeks: 14, startCash: 2000 },
  { id: 'manhattan', name: 'MANHATTAN', description: 'Big money, big risk. Watch your back.', travelCost: 200, volatility: 0.6, policeChance: 0.2, unlocked: true, startingDebt: 25000, maxWeeks: 14, startCash: 2000 },
  { id: 'jersey', name: 'JERSEY CITY', description: 'Market crashes are common. Read the news.', travelCost: 250, volatility: 0.7, policeChance: 0.2, unlocked: true, startingDebt: 40000, maxWeeks: 13, startCash: 2000 },
  { id: 'miami', name: 'MIAMI', description: 'The coast guard watches every flight in.', travelCost: 500, volatility: 0.6, policeChance: 0.3, unlocked: true, startingDebt: 75000, maxWeeks: 12, startCash: 500 },
  { id: 'la', name: 'LOS ANGELES', description: 'Rival cartels fight for turf. Stay sharp.', travelCost: 600, volatility: 0.7, policeChance: 0.3, unlocked: true, startingDebt: 100000, maxWeeks: 12, startCash: 500 },
  { id: 'chicago', name: 'CHICAGO', description: 'The informant knows everything. For a price.', travelCost: 400, volatility: 0.8, policeChance: 0.35, unlocked: true, startingDebt: 150000, maxWeeks: 11, startCash: 500 },
  { id: 'detroit', name: 'DETROIT', description: 'The Shark plays rough. Keep your debt low.', travelCost: 350, volatility: 0.7, policeChance: 0.4, unlocked: true, startingDebt: 200000, maxWeeks: 10, startCash: 500 },
  { id: 'tijuana', name: 'TIJUANA', description: 'Border town chaos. Bribe or die.', travelCost: 450, volatility: 0.8, policeChance: 0.5, unlocked: true, startingDebt: 300000, maxWeeks: 10, startCash: 500 },
  { id: 'cartagena', name: 'CARTAGENA', description: 'The Cartel\'s home. Only legends survive.', travelCost: 800, volatility: 0.9, policeChance: 0.6, unlocked: true, startingDebt: 500000, maxWeeks: 8, startCash: 200 },
];

export const DEALERS: Dealer[] = [
  { id: 'fast_hands', name: 'FAST HANDS', description: '+20 Inventory Space. Carry more, sell more.', perk: '+20 Space', bonus: { inventorySpace: 20 } },
  { id: 'iron_skin', name: 'IRON SKIN', description: '+50 Max Health. Survive the toughest fights.', perk: '+50 Health', bonus: { maxHealth: 50, health: 50 } },
  { id: 'sharpshooter', name: 'SHARPSHOOTER', description: '+15 Weapon Damage. End fights quickly.', perk: '+15 Damage', bonus: { weaponDamage: 15 } },
  { id: 'connected', name: 'CONNECTED', description: '-5% Police encounters. Knows all the right people.', perk: 'Stealthy', bonus: {} },
  { id: 'lucky', name: 'LUCKY', description: 'Better market prices. Fortune favors the bold.', perk: 'Better Prices', bonus: {} },
];

export const EVENTS: RandomEvent[] = [
  { id: 'cop_stop', type: 'cop', title: 'POLICE STOP!', description: 'Cops pulled you over at the airport! They want to search your bags.', image: '/cop.png', choices: [
    { id: 'fight', label: 'FIGT', effect: { healthChange: -20 } },
    { id: 'bribe', label: 'BRIBE ($5000)', effect: { cashChange: -5000 } },
    { id: 'flee', label: 'FLEE', effect: { healthChange: -10, cashChange: -2000 } },
  ]},
  { id: 'mugger', type: 'mugger', title: 'MUGGED!', description: 'A thug corners you in a dark alley. Hand over your cash!', image: '/mugger.png', choices: [
    { id: 'fight', label: 'FIGHT', effect: { healthChange: -25 } },
    { id: 'pay', label: 'PAY UP', effect: { cashChange: -3000 } },
    { id: 'run', label: 'RUN', effect: { healthChange: -5, cashChange: -1000 } },
  ]},
  { id: 'market_crash', type: 'market_crash', title: 'MARKET CRASH!', description: 'A massive drug bust flooded the market. Prices are crashing!', autoEffect: { cashChange: 0 } },
  { id: 'market_boom', type: 'market_boom', title: 'DRY SPELL!', description: 'Supply dried up overnight. Prices are through the roof!', autoEffect: { cashChange: 0 } },
  { id: 'tip', type: 'tip', title: 'INSIDE TIP', description: 'A contact whispers that prices will spike next week in a nearby city.', autoEffect: { cashChange: 0 } },
  { id: 'seizure', type: 'seizure', title: 'RANDOM SEARCH!', description: 'Customs found your stash! They confiscated some goods.', autoEffect: { inventoryLoss: { drugId: 'random', percent: 0.3 } } },
  { id: 'rival', type: 'rival', title: 'RIVAL DEALER!', description: 'A rival cartel member is undercutting prices in this district.', autoEffect: { cashChange: 0 } },
  { id: 'old_lady', type: 'old_lady', title: 'VISIT YOUR OLD LADY', description: 'Your girl wants to see you. She\'s been worried sick. Do you make time for her or keep grinding?', image: '/old-lady.png', choices: [
    { id: 'visit', label: 'SPEND TIME WITH HER', effect: { cashChange: -500, healthChange: 25 } },
    { id: 'ignore', label: 'KEEP HUSTLING', effect: { healthChange: -10 } },
  ]},
];
