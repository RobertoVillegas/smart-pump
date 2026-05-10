import { EmailAlreadyInUseError } from "../../domain/errors/email-already-in-use.error";
import { UserNotFoundError } from "../../domain/errors/user-not-found.error";
import type {
  UpdateMeDeps,
  UpdateMeInput,
  UpdateMeOutput,
} from "../contracts/update-me.contract";

export const createUpdateMeUseCase =
  ({ users }: UpdateMeDeps) =>
  async ({ profile, userId }: UpdateMeInput): Promise<UpdateMeOutput> => {
    if (profile.email) {
      const existingUser = await users.findByEmail(profile.email);

      if (existingUser && existingUser.id !== userId) {
        throw new EmailAlreadyInUseError();
      }
    }

    const user = await users.updateProfile(userId, profile);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  };
