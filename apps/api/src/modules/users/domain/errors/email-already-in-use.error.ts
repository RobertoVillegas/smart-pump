import { AppError } from "../../../../shared/errors/app-error";

export class EmailAlreadyInUseError extends AppError {
  constructor() {
    super({
      code: "USER_EMAIL_ALREADY_IN_USE",
      details:
        "A profile update attempted to assign an email address already owned by another user.",
      kind: "conflict",
      message: "Email is already in use",
    });
    this.name = "EmailAlreadyInUseError";
  }
}
