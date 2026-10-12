import { CasinoPlatform, BonusType } from '../types';

export const platformNames: Record<CasinoPlatform, string> = {
  betmgm: 'BetMGM',
  draftkings: 'DraftKings',
  caesars: 'Caesars',
  fanuel: 'FanDuel',
  golden_nugget: 'Golden Nugget',
  borgata: 'Borgata',
  hard_rock: 'Hard Rock',
  unibet: 'Unibet',
  other: 'Diğer',
};

export const bonusTypeNames: Record<BonusType, string> = {
  free_spins: 'Free Spins',
  deposit_match: 'Deposit Match',
  no_deposit: 'No Deposit',
  cashback: 'Cashback',
};

export const platforms: CasinoPlatform[] = [
  'betmgm', 'draftkings', 'caesars', 'fanuel', 
  'golden_nugget', 'borgata', 'hard_rock', 'unibet', 'other'
];

export const bonusTypes: BonusType[] = [
  'free_spins', 'deposit_match', 'no_deposit', 'cashback'
];
