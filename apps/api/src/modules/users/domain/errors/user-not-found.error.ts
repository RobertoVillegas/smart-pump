import { AppError } from "../../../../shared/errors/app-error";

export class UserNotFoundError extends AppError {
  constructor() {
    super({
      code: "USER_NOT_FOUND",
      details:
        "A user lookup returned no matching record for the requested identifier.",
      kind: "not_found",
      message: "User not found",
    });
    this.name = "UserNotFoundError";
  }
}
