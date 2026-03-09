import type { Fintech, PaymentFrequency } from "@/types/index.types.js";
import { calculateSavings } from "@/core/interest-calculator.js";
import { getRateForDuration } from "../utils.js";

export const fairmoney: Fintech = {
  id: "fairmoney",
  name: "FairMoney",
  products: [
    {
      name: "FairLock",
      supportedTypes: ["onetime"],
      features: [
        {
          name: "Withdrawal",
          value: "No withdrawal before maturity",
          type: "warning",
        },
        { name: "Compound Interest", value: "No", type: "neutral" },
        { name: "Minimum Duration", value: "7 days", type: "neutral" },
        { name: "Top-up", value: "No", type: "neutral" },
        { name: "Minimum Amount", value: "N1000", type: "neutral" },
      ],
      warnings: ["Funds locked until maturity date"],
      maxDurationDays: 720,
      calculate: (
        principal: number,
        duration: number,
        frequency: PaymentFrequency,
      ) => {
        const tiers = [
          { maxDays: 60, rate: 16 },
          { maxDays: 90, rate: 17 },
          { maxDays: 180, rate: 18 },
          { maxDays: 365, rate: 19 },
          { maxDays: 720, rate: 20 },
          { maxDays: Infinity, rate: 21 },
        ];
        const rate = getRateForDuration(duration, tiers);

        const result = calculateSavings(principal, rate, duration, frequency);
        return { ...result, rateLabel: `${rate}% p.a` };
      },
    },
  ],
};
