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
