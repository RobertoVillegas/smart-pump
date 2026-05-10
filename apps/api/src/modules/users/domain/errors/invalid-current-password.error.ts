import { AppError } from "../../../../shared/errors/app-error";

export class InvalidCurrentPasswordError extends AppError {
  constructor() {
    super({
      code: "USER_INVALID_CURRENT_PASSWORD",
      details:
        "The supplied current password did not match the authenticated user's stored password.",
      kind: "forbidden",
      message: "Current password is incorrect",
    });
    this.name = "InvalidCurrentPasswordError";
  }
}
