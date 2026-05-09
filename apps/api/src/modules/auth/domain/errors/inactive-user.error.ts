export class InactiveUserError extends Error {
  constructor() {
    super("User account is inactive");
    this.name = "InactiveUserError";
  }
}
