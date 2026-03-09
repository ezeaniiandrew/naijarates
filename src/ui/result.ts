import {
  formatCurrency,
  requireElement,
  requireChild,
} from "@/shared/helpers.js";
import { getValidProducts } from "@/savings/index.js";
import type {
  Fintech,
  FintechProduct,
  ActiveParams,
} from "@/types/index.types.js";

const resultsContainer = requireElement("results");
const cardTemplate = requireElement<HTMLTemplateElement>("card-template");
const featureRowTemplate = requireElement<HTMLTemplateElement>(
  "feature-row-template",
);
const warningRowTemplate = requireElement<HTMLTemplateElement>(
  "warning-row-template",
);

function showResultMessage(text: string) {
  const p = document.createElement("p");
  p.className = "results-message with-margin";
  p.textContent = text;
  resultsContainer.replaceChildren(p);
}

function calculateCard(
  card: HTMLElement,
  product: FintechProduct,
  params: ActiveParams,
) {
  const result = product.calculate(
    params.principal,
    params.duration,
    params.frequency,
  );

  requireChild(card, '[data-target="rate-badge"]').textContent =
    result.rateLabel || "0%";
  requireChild(card, '[data-target="val-principal"]').textContent =
    formatCurrency(result.principal);
  requireChild(card, '[data-target="val-gross"]').textContent = formatCurrency(
    result.interest,
  );
  requireChild(card, '[data-target="val-tax"]').textContent =
    `-${formatCurrency(result.withholding_tax_amount)}`;
  requireChild(card, '[data-target="val-net"]').textContent = formatCurrency(
    result.interest - result.withholding_tax_amount,
  );
  requireChild(card, '[data-target="val-total"]').textContent = formatCurrency(
    result.total_after_tax,
  );

  const featuresContainer = requireChild(
    card,
    '[data-target="features-container"]',
  );
  featuresContainer.replaceChildren();

  if (product.features) {
    const featuresFrag = document.createDocumentFragment();
    product.features.forEach((featureObj) => {
      const rowFrag = featureRowTemplate.content.cloneNode(
        true,
      ) as DocumentFragment;

      const labelGroup = requireChild(
        rowFrag,
        '[data-target="feature-label-group"]',
      );
      requireChild(labelGroup, '[data-target="detail-label"]').textContent =
        featureObj.name;

      const dotSpan = requireChild(labelGroup, '[data-target="feature-dot"]');
      dotSpan.classList.add(`dot-${featureObj.type}`);

      const valueSpan = requireChild(rowFrag, '[data-target="detail-value"]');
      valueSpan.textContent = featureObj.value;

      featuresFrag.appendChild(rowFrag);
    });
    featuresContainer.appendChild(featuresFrag);
  }

  if (product.warnings && product.warnings.length > 0) {
    const warningContainer = document.createElement("div");
    warningContainer.className = "warning-features";
    product.warnings.forEach((text) => {
      const rowFrag = warningRowTemplate.content.cloneNode(
        true,
      ) as DocumentFragment;
      const warningBox = requireChild(rowFrag, '[data-target="warning-box"]');
      requireChild(warningBox, '[data-target="detail-value"]').textContent =
        text;
      warningContainer.appendChild(warningBox);
    });
    featuresContainer.appendChild(warningContainer);
  }
}

function createCard(
  fintech: Fintech,
  validProducts: FintechProduct[],
  params: ActiveParams,
) {
  const cardFrag = cardTemplate.content.cloneNode(true) as DocumentFragment;
  const card = requireChild(cardFrag, '[data-target="card"]');
  requireChild(card, '[data-target="fintech-name"]').textContent = fintech.name;

  const select = requireChild<HTMLSelectElement>(
    card,
    '[data-target="product-select"]',
  );
  validProducts.forEach((p, index) => {
    const opt = document.createElement("option");
    opt.value = String(index);
    opt.textContent = p.name;
    select.appendChild(opt);
  });

  select.addEventListener("change", () => {
    const selectedProduct = validProducts[parseInt(select.value, 10)]!;
    calculateCard(card, selectedProduct, params);
  });

  calculateCard(card, validProducts[0]!, params);
  return card;
}

export function renderResults(
  fintechData: Fintech[],
  selectedIds: string[],
  params: ActiveParams,
) {
  if (selectedIds.length === 0) {
    return showResultMessage("Please select at least one fintech to compare.");
  }

  resultsContainer.replaceChildren();
  const fragment = document.createDocumentFragment();
  let cardsRendered = 0;

  fintechData.forEach((fintech) => {
    if (!selectedIds.includes(fintech.id)) return;

    const result = getValidProducts(fintech, params.frequency, params.duration);
    if (!result) return;

    fragment.appendChild(createCard(fintech, result, params));
    cardsRendered++;
  });

  resultsContainer.appendChild(fragment);

  if (cardsRendered === 0) {
    showResultMessage(
      "None of the selected fintechs support the current combination of duration, frequency, or deposit amount.",
    );
  }
}
