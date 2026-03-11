import type { Fintech } from "@/types/index.types.js";
import { calculateTieredInterest } from "@/core/interest-calculator.js";
import { getRateForDuration } from "../utils.js";

export const opay: Fintech = {
  id: "opay",
  name: "OPay",
  products: [
    {
      name: "Fixed",
      supportedTypes: ["onetime"],
      features: [
        { name: "Withdrawal", value: "At maturity", type: "neutral" },
        { name: "Compound Interest", value: "No", type: "neutral" },
        { name: "Minimum Duration", value: "7 days", type: "neutral" },
        { name: "Top-up", value: "No", type: "neutral" },
        { name: "Minimum Amount", value: "₦1000", type: "neutral" },
      ],
      warnings: ["Early withdrawal forfeits interest and incurs a 1% fee."],
      calculate: (principal: number, duration: number) => {
        const TIER1_LIMIT = 300000;
        const TIER2_RATE = 9;

        const tiers = [
          { maxDays: 60, rate: 15 },
          { maxDays: 180, rate: 16 },
          { maxDays: 364, rate: 17 },
          { maxDays: Infinity, rate: 18 },
        ];
        const tier1Rate = getRateForDuration(duration, tiers);

        const result = calculateTieredInterest(
          principal,
          duration,
          [
            { limit: TIER1_LIMIT, rate: tier1Rate },
            { limit: Infinity, rate: TIER2_RATE },
          ],
          0.1,
        );

        const rateLabel =
          principal <= TIER1_LIMIT
            ? `${tier1Rate}% p.a`
            : `${tier1Rate}% / ${TIER2_RATE}% (Tiered)`;

        return { ...result, rateLabel };
      },
    },
  ],
};
