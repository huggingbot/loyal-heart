import type { ColumnType } from "kysely";

export type Decimal = ColumnType<string, string | number, string | number>;

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Campaign {
  id: Generated<number>;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  partnerId: number;
  userActionId: number;
  couponId: number;
}

export interface Coupon {
  id: Generated<number>;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  code: string;
  partnerId: number | null;
  userId: number | null;
  rewardId: number;
  usageCount: number | null;
  maxUsage: number | null;
  validFrom: Date | null;
  validTo: Date | null;
}

export interface Partner {
  id: Generated<number>;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  name: string;
  phoneNumber: string | null;
  email: string;
  password: string;
  publicKey: string | null;
}

export interface PartnerSubscription {
  id: Generated<number>;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  partnerId: number;
  partnerTierId: number;
  startDate: Date | null;
  endDate: Date | null;
}

export interface PartnerTier {
  id: Generated<number>;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  name: string;
  plan: "base" | "enterprise_a" | "enterprise_b" | "enterprise_c" | "growth" | "scale";
  addon: string | null;
}

export interface Referral {
  id: Generated<number>;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  referrerId: number;
  referredId: number;
  referrerCouponId: number | null;
  referredCouponId: number | null;
  referrerCouponUsageDate: Date | null;
  referredCouponUsageDate: Date | null;
}

export interface Reward {
  id: Generated<number>;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  name: string;
  type: "discount_percent" | "discount_value" | "points";
  value: Decimal;
}

export interface User {
  id: Generated<number>;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  partnerId: number;
  name: string;
  dateOfBirth: Date | null;
  phoneNumber: string | null;
  email: string | null;
  password: string | null;
  role: Generated<"admin" | "editor" | "super_admin" | "viewer">;
}

export interface UserAction {
  id: Generated<number>;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  name: string;
  category: "discount_percent_earned" | "discount_percent_spent" | "discount_value_earned" | "discount_value_spent" | "points_earned" | "points_spent";
}

export interface UserStat {
  id: Generated<number>;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  userId: number;
  pointsEarned: number | null;
  pointsSpent: number | null;
}

export interface UserSubscription {
  id: Generated<number>;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  userId: number;
  userTierId: number;
  startDate: Date | null;
  endDate: Date | null;
}

export interface UserTier {
  id: Generated<number>;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  name: string;
  pointsRequired: number | null;
  pointsMultiplier: Generated<Decimal | null>;
}

export interface UserTransaction {
  id: Generated<number>;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  userId: number;
  userActionId: number;
}

export interface UserTransactionCoupon {
  id: Generated<number>;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  userTransactionId: number;
  couponId: number;
  couponType: "earned" | "spent";
}

export interface DB {
  campaign: Campaign;
  coupon: Coupon;
  partner: Partner;
  partnerSubscription: PartnerSubscription;
  partnerTier: PartnerTier;
  referral: Referral;
  reward: Reward;
  user: User;
  userAction: UserAction;
  userStat: UserStat;
  userSubscription: UserSubscription;
  userTier: UserTier;
  userTransaction: UserTransaction;
  userTransactionCoupon: UserTransactionCoupon;
}
