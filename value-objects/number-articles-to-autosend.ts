import { z } from "zod";

export const NumberOfArticlesToAutosendDefault = 5;

export const NumberOfArticlesToAutosend = z
  .number()
  .positive()
  .max(10)
  .default(NumberOfArticlesToAutosendDefault);

export type NumberOfArticlesToAutosendType = z.infer<
  typeof NumberOfArticlesToAutosend
>;
