import type { MiddlewareHandler } from "hono";

import type { AuthUserRepository } from "../../modules/auth/application/ports/auth-user-repository.port";
import type { SessionRepository } from "../../modules/auth/application/ports/session-repository.port";
import { UnauthorizedError } from "../../modules/auth/domain/errors/unauthorized.error";
import { authUserToSessionPayload } from "../../modules/auth/domain/mappers/session.mapper";
import type { CurrentUser } from "./current-user";
import { getSessionCookie } from "./session-cookie";

export interface AuthVariables {
  user: CurrentUser;
}

interface AuthDeps {
  sessions: SessionRepository;
  users: AuthUserRepository;
}

export const createAuthMiddleware =
  ({
    sessions,
    users,
  }: AuthDeps): MiddlewareHandler<{ Variables: AuthVariables }> =>
  async (context, next) => {
    const sessionId = getSessionCookie(context);

    if (!sessionId) {
      throw new UnauthorizedError();
    }

    const session = await sessions.findById(sessionId);

    if (!session || new Date(session.expiresAt) <= new Date()) {
      if (session) {
        await sessions.deleteById(session.id);
      }
      throw new UnauthorizedError();
    }

    const user = await users.findById(session.userId);

    if (!user || !user.isActive) {
      throw new UnauthorizedError();
    }

    context.set("user", authUserToSessionPayload(user));

    await next();
  };
