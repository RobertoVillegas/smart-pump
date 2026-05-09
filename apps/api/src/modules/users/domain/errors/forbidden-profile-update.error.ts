import { AppError } from "../../../../shared/errors/app-error";

export class ForbiddenProfileUpdateError extends AppError {
  constructor() {
    super({
      code: "USER_PROFILE_FIELD_NOT_EDITABLE",
      details:
        "A profile update included a field outside the editable user profile allowlist.",
      kind: "forbidden",
      message: "Profile field is not editable",
    });
    this.name = "ForbiddenProfileUpdateError";
  }
}
