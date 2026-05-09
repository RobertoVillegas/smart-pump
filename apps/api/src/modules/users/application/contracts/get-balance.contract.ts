import type { UserRepository } from "../../domain/repositories/user.repository";
import type { UserBalance } from "../../domain/types/user-balance.type";

export type GetBalanceInput = string;

export type GetBalanceOutput = UserBalance;

export interface GetBalanceDeps {
  users: UserRepository;
}
