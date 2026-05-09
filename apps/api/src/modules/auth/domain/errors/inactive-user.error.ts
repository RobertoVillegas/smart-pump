import { AppError } from "../../../../shared/http/errors";

export class InactiveUserError extends AppError {
  constructor() {
    super("User account is inactive", 403);
    this.name = "InactiveUserError";
  }
}
