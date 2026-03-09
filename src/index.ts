import { fintechData } from "./savings";
import { requireElement } from "./shared/helpers";
import { initFilters } from "./ui/filters";
import { initInputs } from "./ui/form";

document.addEventListener("DOMContentLoaded", () => {
  const fintechFilterContainer = requireElement("fintech-filter");

  const inputs = initInputs((params) => {
    if (params) console.log(params);
  });

  const filters = initFilters(
    fintechFilterContainer,
    inputs.getLastParams,
    (selectedIds) => {
      inputs.disableCalculateBtn(selectedIds.length === 0);

      const params = inputs.getLastParams();
      if (params) {
        console.log("Selected fintech IDs:", selectedIds);
      }
    },
  );

  filters.generateCheckboxes(fintechData);
});
