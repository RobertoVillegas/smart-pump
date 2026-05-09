import { UserNotFoundError } from "../../domain/errors/user-not-found.error";
import type {
  GetBalanceDeps,
  GetBalanceInput,
  GetBalanceOutput,
} from "../contracts/get-balance.contract";

export const createGetBalanceUseCase =
  ({ users }: GetBalanceDeps) =>
  async (userId: GetBalanceInput): Promise<GetBalanceOutput> => {
    const user = await users.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    return { balance: user.balance };
  };
