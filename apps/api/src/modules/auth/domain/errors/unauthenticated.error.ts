import { AppError } from "../../../../shared/http/errors";

export class UnauthenticatedError extends AppError {
  constructor() {
    super("Authentication required", 401);
    this.name = "UnauthenticatedError";
  }
}
