import type { ContentfulStatusCode } from "hono/utils/http-status";

interface HttpErrorOptions {
  cause?: unknown;
  code?: string;
  details?: string;
}

export class HttpError extends Error {
  public readonly code?: string;
  public readonly details?: string;
  public readonly statusCode: ContentfulStatusCode;

  constructor(
    message: string,
    statusCode: ContentfulStatusCode,
    options: HttpErrorOptions = {}
  ) {
    super(message, { cause: options.cause });
    this.name = "HttpError";
    this.code = options.code;
    this.details = options.details;
    this.statusCode = statusCode;
  }
}
