import type { ChangePasswordRequest } from "@smart-pump/contracts/users";

import type { UserRepository } from "../ports/user-repository.port";

export interface ChangePasswordDeps {
  users: UserRepository;
}

export interface ChangePasswordInput {
  password: ChangePasswordRequest;
  userId: string;
}

export interface ChangePasswordOutput {
  success: true;
}
