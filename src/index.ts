import { getValidationErrorModal } from "./core/validation";
import { fintechData } from "./savings";
import { requireElement } from "./shared/helpers";
import { ActiveParams } from "./types/index.types";
import { initFilters } from "./ui/filters";
import { initInputs } from "./ui/form";
import { showModal } from "./ui/modal";
import { renderResults } from "./ui/result";

document.addEventListener("DOMContentLoaded", () => {
  const fintechFilterContainer = requireElement("fintech-filter");

  const inputs = initInputs((params) => {
    if (params) handleCalculationRequest(params);
  });

  const filters = initFilters(
    fintechFilterContainer,
    inputs.getLastParams,
    (selectedIds) => {
      inputs.disableCalculateBtn(selectedIds.length === 0);

      const params = inputs.getLastParams();
      if (params) {
        renderResults(fintechData, selectedIds, params);
      }
    },
  );

  filters.generateCheckboxes(fintechData);

  function isValidSelection(
    params: ActiveParams,
    selectedIds: string[],
  ): boolean {
    const errorModal = getValidationErrorModal(
      params,
      selectedIds,
      "calculator",
    );

    if (errorModal) {
      showModal(errorModal);
      inputs.clearLastParams();
      return false;
    }

    return true;
  }

  function handleCalculationRequest(params: ActiveParams) {
    const selectedIds = filters.getSelectedIds();

    if (isValidSelection(params, selectedIds)) {
      renderResults(fintechData, selectedIds, params);
    }
  }

  inputs.simulateCalculateBtnClick();
});
