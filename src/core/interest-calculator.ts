import { MIN_DURATION_DAYS } from "@/savings/index.js";
import type {
  InterestCalculationResult,
  PaymentFrequency,
} from "@/types/index.types.js";

const WITHHOLDING_TAX_RATE = 10;

function calculateNumberOfPeriods(
  frequency: PaymentFrequency,
  durationDays: number,
): number {
  if (frequency.toLowerCase() === "onetime") return 1;

  const match = {
    daily: 1,
    weekly: 7,
    monthly: 30,
  }[frequency.toLowerCase() as "daily" | "weekly" | "monthly"];

  if (!match) throw new Error(`Unsupported frequency: ${frequency}`);
  return Math.floor(durationDays / match);
}

function calculateWithholdingTax(interest: number, withholdingTaxRate: number) {
  const taxAmount = interest * withholdingTaxRate;
  const netInterest = interest - taxAmount;

  return { taxAmount, netInterest };
}

export function calculateSavings(
  amount: number,
  annualRate: number,
  durationDays: number,
  frequency: PaymentFrequency,
  isCompounding: boolean = false,
  withholdingTaxRate: number = WITHHOLDING_TAX_RATE,
): InterestCalculationResult {
  const freq = frequency.toLowerCase() as PaymentFrequency;
  const annualRateInDecimal = annualRate / 100;
  const withholdingTaxRateInDecimal = withholdingTaxRate / 100;

  if (durationDays < MIN_DURATION_DAYS) {
    throw new Error(`Duration must be at least ${MIN_DURATION_DAYS} days`);
  }

  if (freq === "onetime") {
    return calculateOneTimePayment(
      amount,
      annualRateInDecimal,
      durationDays,
      withholdingTaxRateInDecimal,
    );
  }

  const numberOfPeriods = calculateNumberOfPeriods(freq, durationDays);
  return calculateRecurringPayment(
    amount,
    annualRateInDecimal,
    numberOfPeriods,
    freq,
    isCompounding,
    withholdingTaxRateInDecimal,
  );
}

function calculateOneTimePayment(
  principal: number,
  annualRate: number,
  days: number,
  withholdingTaxRate: number,
): InterestCalculationResult {
  const ratePerPeriod = Math.pow(1 + annualRate, days / 365) - 1;
  const totalBeforeTax = principal * (1 + ratePerPeriod);
  const interest = totalBeforeTax - principal;
  const { taxAmount, netInterest } = calculateWithholdingTax(
    interest,
    withholdingTaxRate,
  );
  const totalAfterTax = principal + netInterest;

  return {
    principal,
    withholding_tax_amount: taxAmount,
    total_after_tax: totalAfterTax,
    interest,
  };
}

function calculateRecurringPayment(
  payment: number,
  annualRate: number,
  numberOfPeriods: number,
  frequency: PaymentFrequency,
  isCompounding: boolean,
  withholdingTaxRate: number,
): InterestCalculationResult {
  const periodsPerYear = {
    daily: 365,
    weekly: 52,
    monthly: 12,
  }[frequency.toLowerCase() as "daily" | "weekly" | "monthly"];

  if (!periodsPerYear) {
    throw new Error(`Unsupported frequency: ${frequency}`);
  }

  const ratePerPeriod = !isCompounding
    ? annualRate / periodsPerYear
    : Math.pow(1 + annualRate, 1 / periodsPerYear) - 1;

  let futureValue =
    payment *
    ((Math.pow(1 + ratePerPeriod, numberOfPeriods) - 1) / ratePerPeriod);

  // We multiply by (1 + rate) to treat this as an "Annuity Due" because that very first
  // deposit (and all subsequent ones) earns interest for the entire period it's deposited.
  // Ref: https://www.investopedia.com/terms/a/annuitydue.asp
  futureValue *= 1 + ratePerPeriod;

  const principal = payment * numberOfPeriods;
  const interest = futureValue - principal;
  const { taxAmount, netInterest } = calculateWithholdingTax(
    interest,
    withholdingTaxRate,
  );

  return {
    principal,
    interest,
    withholding_tax_amount: taxAmount,
    total_after_tax: principal + netInterest,
  };
}

export function calculateTieredInterest(
  balance: number,
  duration: number,
  tiers: { limit: number; rate: number }[],
  withholdingTaxRate: number = 0.1,
): InterestCalculationResult {
  if (!balance || balance <= 0) {
    throw new Error("Balance must be greater than 0");
  }

  if (!Array.isArray(tiers) || tiers.length === 0) {
    throw new Error("Tiers must be a non-empty array");
  }

  for (let i = 0; i < tiers.length - 1; i++) {
    if (tiers[i]!.limit >= tiers[i + 1]!.limit) {
      throw new Error("Tier limits must be in ascending order");
    }
  }

  if (tiers[tiers.length - 1]!.limit !== Infinity) {
    throw new Error(
      "Last tier limit must be Infinity to handle any balance size",
    );
  }

  let remainingBalance = balance;
  let previousLimit = 0;
  let totalInterest = 0;

  for (let i = 0; i < tiers.length; i++) {
    const { limit, rate } = tiers[i]!;
    if (remainingBalance <= 0) break;

    const tierCeiling = limit - previousLimit;
    const tierAmount = Math.min(remainingBalance, tierCeiling);
    const tierInterest = tierAmount * (rate / 100) * (duration / 365);

    totalInterest += tierInterest;
    remainingBalance -= tierAmount;
    previousLimit = limit;
  }

  const { taxAmount, netInterest } = calculateWithholdingTax(
    totalInterest,
    withholdingTaxRate,
  );

  return {
    principal: balance,
    interest: totalInterest,
    withholding_tax_amount: taxAmount,
    total_after_tax: balance + netInterest,
  };
}
