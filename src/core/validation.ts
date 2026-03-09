import { fintechData } from "@/savings/index.js";
import type {
  PaymentFrequency,
  ActiveParams,
  ModalConfig,
  ValidationContext,
  FintechProduct,
} from "@/types/index.types.js";

function getRecurringError(params: ActiveParams, selectedIds: string[]) {
  if (params.frequency === "onetime") return null;
  const supportsRecurring = fintechData.filter((f) =>
    f.products.some((p: FintechProduct) =>
      p.supportedTypes.includes(params.frequency as PaymentFrequency),
    ),
  );
  const unsupportedSelected = selectedIds.filter(
    (id) => !supportsRecurring.some((sup) => sup.id === id),
  );

  if (unsupportedSelected.length > 0 && supportsRecurring.length > 0) {
    return { supportsRecurring };
  }
  return null;
}

function getDurationError(params: ActiveParams, selectedIds: string[]) {
  const d = params.duration;

  for (const f of fintechData) {
    if (!selectedIds.includes(f.id)) continue;

    const minProduct = f.products.find(
      (p: FintechProduct) =>
        p.minDurationDays !== undefined && d < p.minDurationDays,
    );
    if (minProduct && minProduct.minDurationDays !== undefined) {
      return { type: "MIN", fintech: f, limit: minProduct.minDurationDays };
    }

    const maxProduct = f.products.find(
      (p: FintechProduct) =>
        p.maxDurationDays !== undefined && d > p.maxDurationDays,
    );
    if (maxProduct && maxProduct.maxDurationDays !== undefined) {
      return { type: "MAX", fintech: f, limit: maxProduct.maxDurationDays };
    }
  }

  return null;
}

export function getValidationErrorModal(
  params: ActiveParams,
  selectedIds: string[],
  context: ValidationContext,
): ModalConfig | null {
  const recurringError = getRecurringError(params, selectedIds);
  if (recurringError) {
    const names = recurringError.supportsRecurring
      .map((f) => f.name)
      .join(" and ");

    if (context === "filter") {
      const fintech = fintechData.find(
        (f) => selectedIds.includes(f.id) && f.name !== names,
      );
      if (!fintech) return null;
      return {
        title: "Cannot Select Provider",
        messages: [
          `You cannot select <strong>${fintech.name}</strong> while calculating for a <strong>${params.frequency}</strong> deposit frequency.`,
          `Please calculate again with a "One-time" frequency to include this provider.`,
        ],
      };
    }

    return {
      title: "Recurring Plan Selected",
      messages: [
        `You have selected a <strong>${params.frequency}</strong> deposit frequency.`,
        `Please note that only <strong>${names}</strong> supports recurring deposits.`,
        `Please either change your frequency to <strong>One-time</strong>, or uncheck the other fintechs to continue.`,
      ],
    };
  }

  const durationError = getDurationError(params, selectedIds);
  if (durationError) {
    const { type, fintech, limit } = durationError;
    const isMinError = type === "MIN";

    if (context === "filter") {
      if (isMinError) {
        return {
          title: "Duration Too Short",
          messages: [
            `You cannot select <strong>${fintech.name}</strong> because they require a minimum savings duration of <strong>${limit} days</strong>.`,
            `Please calculate again with a duration of at least <strong>${limit} days</strong> to include this provider.`,
          ],
        };
      }
      return {
        title: "Duration Too Long",
        messages: [
          `You cannot select <strong>${fintech.name}</strong> because they require a maximum savings duration of <strong>${limit} days</strong>.`,
          `Please calculate again with a duration of <strong>${limit} days</strong> or less to include this provider.`,
        ],
      };
    }

    if (isMinError) {
      return {
        title: "Heads Up!",
        messages: [
          `<strong>${fintech.name}</strong> requires a minimum savings duration of <strong>${Math.floor(limit / 30)} months (${limit} days)</strong>.`,
          `Please either increase your duration to at least ${limit} days, or uncheck ${fintech.name} to continue without it.`,
        ],
      };
    }

    return {
      title: "Heads Up!",
      messages: [
        `<strong>${fintech.name}</strong> supports a maximum savings duration of <strong>${limit} days</strong>.`,
        `Please either decrease your duration to ${limit} days or less, or uncheck ${fintech.name} to continue without it.`,
      ],
    };
  }

  return null;
}
