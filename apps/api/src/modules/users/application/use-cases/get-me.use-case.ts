import type { User } from "../../domain/entities/user";
import { UserNotFoundError } from "../../domain/errors/user.errors";
import type { UserRepository } from "../../domain/repositories/user.repository";

interface GetMeDeps {
  users: UserRepository;
}

export const createGetMeUseCase =
  ({ users }: GetMeDeps) =>
  async (userId: string): Promise<User> => {
    const user = await users.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  };
