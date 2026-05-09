import { AppError } from "../../../../shared/errors/app-error";

export class UnauthorizedError extends AppError {
  constructor() {
    super({
      code: "AUTH_UNAUTHORIZED",
      details:
        "A protected resource was requested without a valid active session.",
      kind: "unauthorized",
      message: "Authentication required",
    });
    this.name = "UnauthorizedError";
  }
}
