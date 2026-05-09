import { resolve } from "node:path";

import { z } from "zod";

const envSchema = z.object({
  CORS_ORIGINS: z
    .string()
    .optional()
    .transform((value) =>
      value
        ?.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    )
    .pipe(z.array(z.url()).min(1).optional())
    .default(["http://localhost:3000"]),
  LOWDB_PATH: z
    .string()
    .optional()
    .transform((value) => (value ? resolve(value) : undefined)),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3001),
});

export const env = envSchema.parse(process.env);
