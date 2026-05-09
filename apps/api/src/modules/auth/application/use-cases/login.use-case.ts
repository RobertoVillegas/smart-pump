import { createSessionExpiresAt } from "../../../../shared/auth/session-cookie";
import { createId } from "../../../../shared/utils/ids";
import { InactiveUserError } from "../../domain/errors/inactive-user.error";
import { InvalidCredentialsError } from "../../domain/errors/invalid-credentials.error";
import type {
  LoginDeps,
  LoginInput,
  LoginOutput,
} from "../contracts/login.contract";

export const createLoginUseCase =
  ({ sessions, users }: LoginDeps) =>
  async (input: LoginInput): Promise<LoginOutput> => {
    const user = await users.findByEmail(input.email);

    if (!user || user.password !== input.password) {
      throw new InvalidCredentialsError();
    }

    if (!user.isActive) {
      throw new InactiveUserError();
    }

    const session = await sessions.create({
      expiresAt: createSessionExpiresAt().toISOString(),
      id: createId(),
      userId: user.id,
    });

    return { session, user };
  };
