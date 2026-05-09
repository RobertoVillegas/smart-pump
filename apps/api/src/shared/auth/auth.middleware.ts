import { sessionUserSchema } from "@smart-pump/contracts/auth";
import type { MiddlewareHandler } from "hono";

import { UnauthenticatedError } from "../../modules/auth/domain/errors/unauthenticated.error";
import type { SessionRepository } from "../../modules/auth/domain/repositories/session.repository";
import type { UserRepository } from "../../modules/users/domain/repositories/user.repository";
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
      throw new UnauthenticatedError();
    }

    const session = await sessions.findById(sessionId);

    if (!session || new Date(session.expiresAt) <= new Date()) {
      if (session) {
        await sessions.deleteById(session.id);
      }
      throw new UnauthenticatedError();
    }

    const user = await users.findById(session.userId);

    if (!user || !user.isActive) {
      throw new UnauthenticatedError();
    }

    context.set("user", sessionUserSchema.parse(user));

    await next();
  };
