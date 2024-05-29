import { z } from "zod";

export const ErrorBody = z
  .object({
    statusCode: z.number(),
    message: z.string(),
  })
  .passthrough();
