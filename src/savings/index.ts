import type { Fintech } from "@/types/index.types.js";
import { piggyvest } from "./providers/piggyvest.js";
import { cowrywise } from "./providers/cowrywise.js";
import { opay } from "./providers/opay.js";
import { kuda } from "./providers/kuda.js";
import { palmpay } from "./providers/palmpay.js";
import { fairmoney } from "./providers/fairmoney.js";

export const fintechData: Fintech[] = [
  piggyvest,
  cowrywise,
  opay,
  kuda,
  palmpay,
  fairmoney,
];

export * from "./utils.js";
