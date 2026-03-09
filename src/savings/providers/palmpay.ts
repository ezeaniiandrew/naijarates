import type { Fintech, PaymentFrequency } from "@/types/index.types.js";
import { calculateSavings } from "@/core/interest-calculator.js";
import { getRateForDuration } from "../utils.js";

export const palmpay: Fintech = {
  id: "palmpay",
  name: "PalmPay",
  products: [
    {
      name: "Fixed Savings",
      supportedTypes: ["onetime"],
      features: [
        { name: "Withdrawal", value: "At maturity only", type: "warning" },
        { name: "Compound Interest", value: "No", type: "neutral" },
        { name: "Minimum Duration", value: "7 days", type: "neutral" },
        { name: "Top-up", value: "No", type: "neutral" },
        { name: "Minimum Amount", value: "N1000", type: "neutral" },
      ],
      warnings: ["Forfeit all interest if withdrawn early"],
      calculate: (
        principal: number,
        duration: number,
        frequency: PaymentFrequency,
      ) => {
        const tiers = [
          { maxDays: 59, rate: 10 },
          { maxDays: 89, rate: 12 },
          { maxDays: 179, rate: 15 },
          { maxDays: 359, rate: 18 },
          { maxDays: Infinity, rate: 20 },
        ];
        const rate = getRateForDuration(duration, tiers);

        const result = calculateSavings(principal, rate, duration, frequency);
        return { ...result, rateLabel: `${rate}% p.a` };
      },
    },
  ],
};
