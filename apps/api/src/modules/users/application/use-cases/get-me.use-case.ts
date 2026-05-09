import { UserNotFoundError } from "../../domain/errors/user-not-found.error";
import type {
  GetMeDeps,
  GetMeInput,
  GetMeOutput,
} from "../contracts/get-me.contract";

export const createGetMeUseCase =
  ({ users }: GetMeDeps) =>
  async (userId: GetMeInput): Promise<GetMeOutput> => {
    const user = await users.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  };
