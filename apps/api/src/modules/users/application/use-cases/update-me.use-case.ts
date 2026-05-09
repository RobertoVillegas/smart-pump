import { UserNotFoundError } from "../../domain/errors/user-not-found.error";
import type {
  UpdateMeDeps,
  UpdateMeInput,
  UpdateMeOutput,
} from "../contracts/update-me.contract";

export const createUpdateMeUseCase =
  ({ users }: UpdateMeDeps) =>
  async ({ profile, userId }: UpdateMeInput): Promise<UpdateMeOutput> => {
    const user = await users.updateProfile(userId, profile);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  };
