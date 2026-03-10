import type { Fintech, PaymentFrequency } from "@/types/index.types.js";
import { calculateSavings } from "@/core/interest-calculator.js";
import { getRateForDuration } from "../utils.js";

export const piggyvest: Fintech = {
  id: "piggyvest",
  name: "PiggyVest",
  products: [
    {
      name: "SafeLock",
      supportedTypes: ["onetime"],
      features: [
        {
          name: "Withdrawal",
          value: "Locked until maturity",
          type: "warning",
        },
        { name: "Compound Interest", value: "No", type: "neutral" },
        { name: "Minimum Duration", value: "30 days", type: "neutral" },
        {
          name: "Top-up",
          value: "Allowed if duration > 90 days",
          type: "positive",
        },
        { name: "Minimum Amount", value: "N1000", type: "neutral" },
      ],
      warnings: [
        "All earned interest is forfeited if withdrawn before maturity.",
      ],
      maxDurationDays: 1000,
      calculate: (
        principal: number,
        duration: number,
        frequency: PaymentFrequency,
      ) => {
        const tiers = [
          { maxDays: 30, rate: 15 },
          { maxDays: 60, rate: 16 },
          { maxDays: 90, rate: 17 },
          { maxDays: 180, rate: 18 },
          { maxDays: 270, rate: 18.5 },
          { maxDays: 1000, rate: 19.5 },
        ];
        const rate = getRateForDuration(duration, tiers);

        const result = calculateSavings(principal, rate, duration, frequency);
        return { ...result, rateLabel: `${rate}% p.a` };
      },
    },
  ],
};
