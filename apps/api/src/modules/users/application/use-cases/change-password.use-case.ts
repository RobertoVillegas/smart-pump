import { InvalidCurrentPasswordError } from "../../domain/errors/invalid-current-password.error";
import { UserNotFoundError } from "../../domain/errors/user-not-found.error";
import type {
  ChangePasswordDeps,
  ChangePasswordInput,
  ChangePasswordOutput,
} from "../contracts/change-password.contract";

export const createChangePasswordUseCase =
  ({ users }: ChangePasswordDeps) =>
  async ({
    password,
    userId,
  }: ChangePasswordInput): Promise<ChangePasswordOutput> => {
    const user = await users.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    if (user.password !== password.currentPassword) {
      throw new InvalidCurrentPasswordError();
    }

    const updatedUser = await users.updatePassword(
      userId,
      password.newPassword
    );

    if (!updatedUser) {
      throw new UserNotFoundError();
    }

    return { success: true };
  };
