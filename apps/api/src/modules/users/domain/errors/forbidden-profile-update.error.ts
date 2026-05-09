import { AppError } from "../../../../shared/http/errors";

export class ForbiddenProfileUpdateError extends AppError {
  constructor() {
    super("Profile field is not editable", 403);
    this.name = "ForbiddenProfileUpdateError";
  }
}
