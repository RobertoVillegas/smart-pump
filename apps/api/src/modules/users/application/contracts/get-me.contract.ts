import type { User } from "../../domain/entities/user.entity";
import type { UserRepository } from "../../domain/repositories/user.repository";

export type GetMeInput = string;

export type GetMeOutput = User;

export interface GetMeDeps {
  users: UserRepository;
}
