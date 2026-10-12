export type CasinoPlatform = 
  | 'betmgm' 
  | 'draftkings' 
  | 'caesars' 
  | 'fanuel' 
  | 'golden_nugget' 
  | 'borgata'
  | 'hard_rock'
  | 'unibet';

export type CouponStatus = 'new' | 'active' | 'expired' | 'used';

export type BonusType = 'free_spins' | 'deposit_match' | 'no_deposit' | 'cashback';

export interface Coupon {
  id: string;
  code: string;
  platform: CasinoPlatform;
  status: CouponStatus;
  bonusType: BonusType;
  value: number;
  detectedAt: Date;
  expiresAt: Date;
  isActive: boolean;
}

export interface Stats {
  total: number;
  new: number;
  active: number;
  today: number;
}
