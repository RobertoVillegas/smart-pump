export class ForbiddenProfileUpdateError extends Error {
  constructor() {
    super("Profile field is not editable");
    this.name = "ForbiddenProfileUpdateError";
  }
}
