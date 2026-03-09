export type PaymentFrequency = "daily" | "weekly" | "monthly" | "onetime";

export interface ActiveParams {
  principal: number;
  duration: number;
  frequency: PaymentFrequency;
}
