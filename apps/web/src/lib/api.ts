const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

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
  init: RequestInit = {}
): Promise<TResponse> => {
  const response = await fetch(`${apiBaseUrl}${path}`, {
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

  return (await response.json()) as TResponse;
};
