import { createSessionExpiresAt } from "../../../../shared/auth/session-cookie";
import { createId } from "../../../../shared/utils/ids";
import type { User } from "../../../users/domain/entities/user";
import type { UserRepository } from "../../../users/domain/repositories/user.repository";
import type { Session } from "../../domain/entities/session";
import { InactiveUserError } from "../../domain/errors/inactive-user.error";
import { InvalidCredentialsError } from "../../domain/errors/invalid-credentials.error";
import type { SessionRepository } from "../../domain/repositories/session.repository";
import type { LoginRequest } from "../dtos";

interface LoginDeps {
  sessions: SessionRepository;
  users: UserRepository;
}

export interface LoginResult {
  session: Session;
  user: User;
}

export const createLoginUseCase =
  ({ sessions, users }: LoginDeps) =>
  async (credentials: LoginRequest): Promise<LoginResult> => {
    const user = await users.findByEmail(credentials.email);

    if (!user || user.password !== credentials.password) {
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
