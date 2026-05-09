import { UserNotFoundError } from "../../domain/errors/user.errors";
import type { UserRepository } from "../../domain/repositories/user.repository";

interface GetBalanceDeps {
  users: UserRepository;
}

export const createGetBalanceUseCase =
  ({ users }: GetBalanceDeps) =>
  async (userId: string): Promise<{ balance: string }> => {
    const user = await users.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    return { balance: user.balance };
  };
