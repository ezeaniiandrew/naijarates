import { initInputs } from "./ui/form";

document.addEventListener("DOMContentLoaded", () => {
  const _inputs = initInputs((params) => {
    if (params) console.log(params);
  });
});
