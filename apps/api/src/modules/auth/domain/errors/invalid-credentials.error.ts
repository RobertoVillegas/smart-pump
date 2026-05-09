import { AppError } from "../../../../shared/errors/app-error";

export class InvalidCredentialsError extends AppError {
  constructor() {
    super({
      code: "AUTH_INVALID_CREDENTIALS",
      details:
        "The supplied email/password pair did not match an active credential record.",
      kind: "unauthorized",
      message: "Invalid email or password",
    });
    this.name = "InvalidCredentialsError";
  }
}
