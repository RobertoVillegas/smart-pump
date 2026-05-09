import { zValidator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import type { ZodSchema } from "zod";

export const validate = <
  TTarget extends keyof ValidationTargets,
  TSchema extends ZodSchema,
>(
  target: TTarget,
  schema: TSchema
) =>
  zValidator(target, schema, (result, context) => {
    if (!result.success) {
      return context.json(
        {
          error: {
            issues: result.error.issues,
            message: "Invalid request body",
          },
        },
        400
      );
    }
  });
