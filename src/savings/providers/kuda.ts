import type { Fintech, PaymentFrequency } from "@/types/index.types.js";
import { calculateSavings } from "@/core/interest-calculator.js";
import { getRateForDuration } from "../utils.js";

export const kuda: Fintech = {
  id: "kuda",
  name: "Kuda",
  products: [
    {
      name: "Kuda Fixed",
      supportedTypes: ["onetime"],
      features: [
        { name: "Withdrawal", value: "At maturity only", type: "warning" },
        { name: "Compound Interest", value: "No", type: "neutral" },
        { name: "Minimum Duration", value: "7 days", type: "neutral" },
        { name: "Top-up", value: "No", type: "neutral" },
        { name: "Minimum Amount", value: "N1000", type: "neutral" },
      ],
      warnings: ["Forfeit accrued interest if withdrawn early"],
      calculate: (
        principal: number,
        duration: number,
        frequency: PaymentFrequency,
      ) => {
        const tiers = [
          { maxDays: 59, rate: 10 },
          { maxDays: 89, rate: 10.18 },
          { maxDays: 119, rate: 10.36 },
          { maxDays: 149, rate: 10.55 },
          { maxDays: 179, rate: 10.73 },
          { maxDays: 209, rate: 10.91 },
          { maxDays: 239, rate: 11.09 },
          { maxDays: 269, rate: 11.27 },
          { maxDays: 299, rate: 11.46 },
          { maxDays: 329, rate: 11.64 },
          { maxDays: 359, rate: 11.82 },
          { maxDays: Infinity, rate: 12 },
        ];
        const rate = getRateForDuration(duration, tiers);

        const result = calculateSavings(principal, rate, duration, frequency);
        return { ...result, rateLabel: `${rate}% p.a` };
      },
    },
  ],
};
