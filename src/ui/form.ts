import { MIN_DURATION_DAYS } from "@/savings/index.js";
import {
  calculateDaysDifference,
  calculateTargetDateStr,
  requireElement,
} from "@/shared/helpers.js";
import type { ActiveParams, PaymentFrequency } from "@/types/index.types.js";

export function initInputs(onCalculate: (params: ActiveParams | null) => void) {
  const amountInput = requireElement<HTMLInputElement>("amount");
  const amountError = requireElement("amount-error");
  const frequencyInput = requireElement<HTMLSelectElement>("frequency");
  const datePicker = requireElement<HTMLInputElement>("maturity-date-picker");
  const durationText = requireElement("selected-duration-text");
  const calculateBtn = requireElement<HTMLButtonElement>("calculate-btn");

  let currentDurationDays = 365;
  let lastParams: ActiveParams | null = null;

  durationText.textContent = `${currentDurationDays}`;

  amountInput.addEventListener("input", (e) => {
    const target = e.target as HTMLInputElement;
    const rawStr = target.value.replace(/,/g, "");
    if (!rawStr) {
      target.value = "";
      return;
    }

    // Safely parse pasted decimals (like 1000.5) to an integer (1000)
    const parsedValue = Math.floor(parseFloat(rawStr));
    target.value = parsedValue.toLocaleString("en-US");
  });
  datePicker.min = new Date().toLocaleDateString("en-CA");
  datePicker.value = calculateTargetDateStr(currentDurationDays);

  datePicker.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement;
    if (!target.value) return;

    currentDurationDays = Math.max(
      MIN_DURATION_DAYS,
      calculateDaysDifference(target.value),
    );
    durationText.textContent = `${currentDurationDays}`;
    datePicker.value = calculateTargetDateStr(currentDurationDays);
  });
  const calculatorForm = requireElement<HTMLFormElement>("calculator-form");

  calculatorForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const rawAmountStr = amountInput.value.replace(/,/g, "");
    const rawAmount = parseFloat(rawAmountStr);

    if (isNaN(rawAmount) || rawAmount < 1000) {
      amountError.textContent = "Minimum savings amount is ₦1,000";
      amountError.classList.remove("hidden");
      amountInput.classList.add("input-error-border");

      lastParams = null;
      onCalculate(null);
      return;
    }

    amountError.classList.add("hidden");
    amountInput.classList.remove("input-error-border");

    lastParams = {
      principal: rawAmount,
      duration: currentDurationDays,
      frequency: frequencyInput.value as PaymentFrequency,
    };

    onCalculate(lastParams);
  });

  return {
    getLastParams: () => lastParams,
    clearLastParams: () => {
      lastParams = null;
    },
    disableCalculateBtn: (disabled: boolean) => {
      calculateBtn.disabled = disabled;
    },
    simulateCalculateBtnClick: () => {
      calculateBtn.click();
    },
  };
}
