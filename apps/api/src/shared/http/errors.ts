import type { ContentfulStatusCode } from "hono/utils/http-status";

export class HttpError extends Error {
  public readonly statusCode: ContentfulStatusCode;

  constructor(message: string, statusCode: ContentfulStatusCode) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
}
