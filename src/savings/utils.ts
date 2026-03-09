import { Fintech, FintechProduct, PaymentFrequency } from "@/types/index.types";

export const MIN_DURATION_DAYS = 30;

export function getRateForDuration(
  duration: number,
  tiers: { maxDays: number; rate: number }[],
): number {
  for (const t of tiers) {
    if (duration <= t.maxDays) {
      return t.rate;
    }
  }
  throw new Error(
    `No matching interest rate tier found for duration: ${duration} days`,
  );
}

export function getValidProducts(
  fintech: Fintech,
  frequency: PaymentFrequency,
  duration: number,
): FintechProduct[] | null {
  const validProducts = fintech.products.filter((p) => {
    const supportsType = p.supportedTypes.includes(frequency);
    const meetsDuration = !p.minDurationDays || duration >= p.minDurationDays;
    return supportsType && meetsDuration;
  });

  return validProducts.length > 0 ? validProducts : null;
}
