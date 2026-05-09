import { AppError } from "../../../../shared/errors/app-error";

export class InactiveUserError extends AppError {
  constructor() {
    super({
      code: "AUTH_INACTIVE_USER",
      details: "An inactive user attempted to create a session.",
      kind: "forbidden",
      message: "User account is inactive",
    });
    this.name = "InactiveUserError";
  }
}
