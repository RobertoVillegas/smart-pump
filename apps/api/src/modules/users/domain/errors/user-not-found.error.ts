import { AppError } from "../../../../shared/http/errors";

export class UserNotFoundError extends AppError {
  constructor() {
    super("User not found", 404);
    this.name = "UserNotFoundError";
  }
}
