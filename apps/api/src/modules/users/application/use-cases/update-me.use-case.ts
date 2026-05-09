import type { User } from "../../domain/entities/user";
import { UserNotFoundError } from "../../domain/errors/user.errors";
import type { UserRepository } from "../../domain/repositories/user.repository";
import type { UpdateProfileRequest } from "../dtos";

interface UpdateMeDeps {
  users: UserRepository;
}

export const createUpdateMeUseCase =
  ({ users }: UpdateMeDeps) =>
  async (userId: string, profile: UpdateProfileRequest): Promise<User> => {
    const user = await users.updateProfile(userId, profile);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  };
