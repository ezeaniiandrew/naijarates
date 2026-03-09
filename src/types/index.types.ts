export type PaymentFrequency = "daily" | "weekly" | "monthly" | "onetime";

export interface ActiveParams {
  principal: number;
  duration: number;
  frequency: PaymentFrequency;
}

export type FintechFeature = {
  name: string;
  value: string;
  type: "positive" | "neutral" | "warning";
};

export interface InterestCalculationResult {
  principal: number;
  withholding_tax_amount: number;
  total_after_tax: number;
  interest: number;
  rateLabel?: string;
}

export interface FintechProduct {
  name: string;
  supportedTypes: PaymentFrequency[];
  features: FintechFeature[];
  warnings?: string[];
  minDurationDays?: number;
  maxDurationDays?: number;
  calculate: (
    principal: number,
    duration: number,
    frequency: PaymentFrequency,
  ) => InterestCalculationResult;
}

export interface Fintech {
  id: string;
  name: string;
  products: FintechProduct[];
}

export interface ModalConfig {
  title: string;
  messages: string[];
}

export type ValidationContext = "calculator" | "filter";
