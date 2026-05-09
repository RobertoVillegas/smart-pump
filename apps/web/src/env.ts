import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z
    .url()
    .default("http://localhost:3001")
    .transform((value) => {
      const url = new URL(value).toString();
      return url.endsWith("/") ? url.slice(0, -1) : url;
    }),
});

const parsedEnv = envSchema.parse(import.meta.env);

export const env = {
  apiUrl: parsedEnv.VITE_API_URL,
};
