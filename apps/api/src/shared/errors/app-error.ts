export type AppErrorKind =
  | "bad_request"
  | "conflict"
  | "forbidden"
  | "not_found"
  | "unauthorized"
  | "validation";

interface AppErrorOptions {
  cause?: unknown;
  code: string;
  details?: string;
  kind: AppErrorKind;
  message: string;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly details?: string;
  public readonly kind: AppErrorKind;

  constructor({ cause, code, details, kind, message }: AppErrorOptions) {
    super(message, { cause });
    this.name = "AppError";
    this.code = code;
    this.details = details;
    this.kind = kind;
  }
}
