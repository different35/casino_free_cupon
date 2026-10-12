import { Coupon, CasinoPlatform, BonusType } from '../types';

const platforms: CasinoPlatform[] = ['betmgm', 'draftkings', 'caesars', 'fanuel', 'golden_nugget', 'borgata', 'hard_rock', 'unibet'];
const bonusTypes: BonusType[] = ['free_spins', 'deposit_match', 'no_deposit', 'cashback'];

const platformNames: Record<CasinoPlatform, string> = {
  betmgm: 'BetMGM',
  draftkings: 'DraftKings',
  caesars: 'Caesars',
  fanuel: 'FanDuel',
  golden_nugget: 'Golden Nugget',
  borgata: 'Borgata',
  hard_rock: 'Hard Rock',
  unibet: 'Unibet',
};

const bonusTypeNames: Record<BonusType, string> = {
  free_spins: 'Free Spins',
  deposit_match: 'Deposit Match',
  no_deposit: 'No Deposit',
  cashback: 'Cashback',
};

export { platforms, bonusTypes, platformNames, bonusTypeNames };

function generateCode(): string {
  const prefixes = ['BONUS', 'SPIN', 'FREE', 'LUCKY', 'WIN', 'JACKPOT', 'SLOT', 'REEL'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${suffix}`;
}

export function generateSampleCoupons(): Coupon[] {
  const coupons: Coupon[] = [];
  const now = Date.now();

  for (let i = 0; i < 15; i++) {
    const detectedMinutesAgo = Math.floor(Math.random() * 1440);
    const expiresHoursFromNow = Math.floor(Math.random() * 72) + 1;
    const status = detectedMinutesAgo < 60 ? 'new' : 
                   detectedMinutesAgo < 360 ? 'active' : 
                   Math.random() > 0.7 ? 'expired' : 'active';
    
    coupons.push({
      id: `coupon-${i}`,
      code: generateCode(),
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      status,
      bonusType: bonusTypes[Math.floor(Math.random() * bonusTypes.length)],
      value: Math.floor(Math.random() * 200) + 10,
      detectedAt: new Date(now - detectedMinutesAgo * 60000),
      expiresAt: new Date(now + expiresHoursFromNow * 3600000),
      isActive: status !== 'expired',
    });
  }

  return coupons.sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime());
}
