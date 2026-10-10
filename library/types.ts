import type { CropEntry, Extraction } from "./schema";
import type { CantReadReason } from "./validate";

export type ExtractResponse =
  | {
      status: "ok";
      label: Extraction;
      entry: CropEntry;
    }
  | {
      status: "crop_not_labeled";
      label: Extraction;
    }
  | {
      status: "cant_read";
      reason: CantReadReason;
    }
  | {
      status: "banned";
      activeIngredient: string;
      message: string;
    }
  | {
      status: "error";
      message: string;
    };