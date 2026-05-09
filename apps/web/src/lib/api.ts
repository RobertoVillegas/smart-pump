import type { ZodSchema } from "zod";

import { env } from "../env";

interface ApiErrorBody {
  error?: {
    message?: string;
  };
}

export class ApiError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const apiRequest = async <TResponse>(
  path: string,
  schema: ZodSchema<TResponse>,
  init: RequestInit = {}
): Promise<TResponse> => {
  const response = await fetch(`${env.apiUrl}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "content-type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiErrorBody;

    throw new ApiError(
      body.error?.message ?? "Request failed",
      response.status
    );
  }

  return schema.parse(await response.json());
};
