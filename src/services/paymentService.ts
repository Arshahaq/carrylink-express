/**
 * Demo payment service. No real money movement, no escrow, no payment provider.
 * Swap these functions for a real provider integration later.
 */
export interface DemoPaymentBreakdown {
  travelerReward: number;
  platformFee: number;
  total: number;
}

export function quote(rewardInr: number): DemoPaymentBreakdown {
  const platformFee = Math.round(rewardInr * 0.12);
  return { travelerReward: rewardInr, platformFee, total: rewardInr + platformFee };
}

export function formatInr(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}
