import type { MiddlewareHandler } from "hono";

import type { SessionRepository } from "../../modules/auth/domain/repositories/session.repository";
import { toSessionUser } from "../../modules/users/domain/mappers/user.mapper";
import type { UserRepository } from "../../modules/users/domain/repositories/user.repository";
import { AppError } from "../http/errors";
import type { CurrentUser } from "./current-user";
import { getSessionCookie } from "./session-cookie";

export interface AuthVariables {
  user: CurrentUser;
}

interface AuthDeps {
  sessions: SessionRepository;
  users: UserRepository;
}

export const createAuthMiddleware =
  ({
    sessions,
    users,
  }: AuthDeps): MiddlewareHandler<{ Variables: AuthVariables }> =>
  async (context, next) => {
    const sessionId = getSessionCookie(context);

    if (!sessionId) {
      throw new AppError("Authentication required", 401);
    }

    const session = await sessions.findById(sessionId);

    if (!session || new Date(session.expiresAt) <= new Date()) {
      if (session) {
        await sessions.deleteById(session.id);
      }

      throw new AppError("Authentication required", 401);
    }

    const user = await users.findById(session.userId);

    if (!user || !user.isActive) {
      throw new AppError("Authentication required", 401);
    }

    context.set("user", toSessionUser(user));

    await next();
  };
