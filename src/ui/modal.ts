import { requireElement } from "@/shared/helpers.js";
import type { ModalConfig } from "@/types/index.types.js";

const modal = requireElement<HTMLDialogElement>("modal");
const modalTitle = requireElement("modal-title");
const modalBody = requireElement("modal-body");
const modalProceedBtn = requireElement<HTMLButtonElement>("modal-proceed-btn");

let abortController: AbortController | undefined;

export function hideModal() {
  modal.close();
}

export function showModal(config: ModalConfig) {
  modalTitle.textContent = config.title;
  modalBody.innerHTML = config.messages.map((m) => `<p>${m}</p>`).join("");
  modalProceedBtn.textContent = "Understood";

  abortController?.abort();
  abortController = new AbortController();

  modalProceedBtn.addEventListener("click", hideModal, {
    signal: abortController.signal,
  });

  modal.showModal();
}
