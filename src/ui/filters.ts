import type { Fintech, ActiveParams } from "@/types/index.types.js";
import { getValidationErrorModal } from "@/core/validation.js";
import { showModal } from "./modal.js";

export function initFilters(
  container: HTMLElement,
  paramsGetter: () => ActiveParams | null,
  onChangeCallback: (selectedIds: string[]) => void,
) {
  function getSelectedIds(): string[] {
    const checkboxes = container.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]:checked',
    );
    return Array.from(checkboxes).map((cb) => cb.value);
  }

  container.addEventListener("change", (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.tagName !== "INPUT" || target.type !== "checkbox") return;

    const fintechId = target.value;
    const params = paramsGetter();

    if (target.checked && params) {
      const errorModal = getValidationErrorModal(params, [fintechId], "filter");
      if (errorModal) {
        target.checked = false;
        showModal(errorModal);
        return;
      }
    }

    const potentialSelectedIds = getSelectedIds();
    if (
      params &&
      getValidationErrorModal(params, potentialSelectedIds, "filter")
    ) {
      return;
    }

    onChangeCallback(potentialSelectedIds);
  });

  const template = document.getElementById(
    "filter-checkbox-template",
  ) as HTMLTemplateElement;

  return {
    generateCheckboxes: (data: Fintech[]) => {
      container.innerHTML = "";
      data.forEach((fintech) => {
        const clone = template.content.cloneNode(true) as DocumentFragment;
        const input = clone.querySelector("input")!;
        const nameSpan = clone.querySelector(".fintech-name-label")!;

        input.value = fintech.id;
        input.dataset.id = fintech.id;
        nameSpan.textContent = ` ${fintech.name}`;

        container.appendChild(clone);
      });

      onChangeCallback(getSelectedIds());
    },
    getSelectedIds,
  };
}
