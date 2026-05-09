import { AppError } from "../../../../shared/http/errors";

export class UnauthorizedError extends AppError {
  constructor() {
    super("Authentication required", 401);
    this.name = "UnauthorizedError";
  }
}
