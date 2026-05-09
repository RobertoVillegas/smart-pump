import type { User } from "../../domain/entities/user.entity";
import type { UserRepository } from "../ports/user-repository.port";

export type GetMeInput = string;

export type GetMeOutput = User;

export interface GetMeDeps {
  users: UserRepository;
}
