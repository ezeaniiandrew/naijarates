import type { Fintech, PaymentFrequency } from "@/types/index.types.js";
import { calculateSavings } from "@/core/interest-calculator.js";
import { getRateForDuration } from "../utils.js";

export const cowrywise: Fintech = {
  id: "cowrywise",
  name: "Cowrywise",
  products: [
    {
      name: "Fixed Savings",
      supportedTypes: ["daily", "weekly", "monthly", "onetime"],
      features: [
        { name: "Withdrawal", value: "At maturity only", type: "warning" },
        { name: "Compound Interest", value: "Yes", type: "positive" },
        { name: "Minimum Duration", value: "3 months", type: "neutral" },
        { name: "Top-up", value: "Yes", type: "positive" },
        { name: "Minimum Amount", value: "N1000", type: "neutral" },
      ],
      minDurationDays: 90,
      calculate: (
        principal: number,
        duration: number,
        frequency: PaymentFrequency,
      ) => {
        const tiers = [
          { maxDays: 179, rate: 9.95 },
          { maxDays: 269, rate: 10.95 },
          { maxDays: 364, rate: 11.95 },
          { maxDays: 730, rate: 12.95 },
        ];
        const rate = getRateForDuration(duration, tiers);

        const result = calculateSavings(
          principal,
          rate,
          duration,
          frequency,
          frequency !== "onetime",
        );
        return { ...result, rateLabel: `${rate}% p.a` };
      },
    },
  ],
};
