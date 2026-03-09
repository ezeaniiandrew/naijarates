# Contributing to Naija Rates

## Getting Started

**Prerequisites:** [Node.js](https://nodejs.org) v22+ and [pnpm](https://pnpm.io)

```sh
git clone <repo-url>
cd nerdwallets
pnpm install
pnpm dev     # starts the dev server at http://localhost:5173
```

## Adding a New Fintech

Create a new file in `src/savings/providers/` using an existing provider as a starting point. Each fintech must export a `Fintech` object and be registered in `src/savings/index.ts`.

```ts
import type { Fintech } from "@/types/index.types.js";
import { calculateSavings } from "@/core/interest-calculator.js";

const myBank: Fintech = {
  id: "mybank", // unique, lowercase, no spaces
  name: "My Bank",
  products: [
    {
      name: "Fixed Plan",
      supportedTypes: ["onetime"], // "onetime" | "daily" | "weekly" | "monthly"
      features: [
        { name: "Withdrawal", value: "At maturity only", type: "neutral" },
      ],
      warnings: ["Lose interest if withdrawn early"],
      calculate: (principal, duration) => {
        const rate = 15;
        return {
          ...calculateSavings(principal, rate, duration),
          rateLabel: `${rate}% p.a`,
        };
      },
    },
  ],
};

export default myBank;
```

For balance-tiered rates (where the rate varies by amount), use `calculateTieredInterest` — see [`src/savings/providers/opay.ts`](src/savings/providers/opay.ts) as a reference.

## Commit Messages

This project follows [Conventional Commits](https://www.conventionalcommits.org/). The pre-commit hook will reject non-conforming messages.
