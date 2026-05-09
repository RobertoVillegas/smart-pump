import type { UserBalance } from "../../domain/types/user-balance.type";
import type { UserRepository } from "../ports/user-repository.port";

export type GetBalanceInput = string;

export type GetBalanceOutput = UserBalance;

export interface GetBalanceDeps {
  users: UserRepository;
}
