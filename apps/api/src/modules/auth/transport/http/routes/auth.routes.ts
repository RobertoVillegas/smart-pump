import { Hono } from "hono";

import {
  clearSessionCookie,
  getSessionCookie,
  setSessionCookie,
} from "../../../../../shared/auth/session-cookie";
import { validate } from "../../../../../shared/http/validation";
import { createGetSessionUseCase } from "../../../application/use-cases/get-session.use-case";
import { createLoginUseCase } from "../../../application/use-cases/login.use-case";
import { createLogoutUseCase } from "../../../application/use-cases/logout.use-case";
import { authUserToSessionPayload } from "../../../domain/mappers/session.mapper";
import type { AuthUserRepository } from "../../../domain/repositories/auth-user.repository";
import type { SessionRepository } from "../../../domain/repositories/session.repository";
import { loginRequestSchema, sessionUserSchema } from "../schemas/login.schema";

interface AuthRouteDeps {
  sessions: SessionRepository;
  users: AuthUserRepository;
}

export const createAuthRoutes = ({ sessions, users }: AuthRouteDeps) => {
  const app = new Hono();
  const login = createLoginUseCase({ sessions, users });
  const logout = createLogoutUseCase({ sessions });
  const getSession = createGetSessionUseCase({ sessions, users });

  app.post("/login", validate("json", loginRequestSchema), async (context) => {
    const credentials = context.req.valid("json");
    const { session, user } = await login(credentials);

    setSessionCookie(context, session.id);

    return context.json({
      user: sessionUserSchema.parse(authUserToSessionPayload(user)),
    });
  });

  app.post("/logout", async (context) => {
    await logout(getSessionCookie(context));
    clearSessionCookie(context);

    return context.json({ success: true });
  });

  app.get("/session", async (context) => {
    const result = await getSession(getSessionCookie(context));

    if (!result.authenticated) {
      if (result.staleSessionId) {
        clearSessionCookie(context);
      }
      return context.json({ authenticated: false, user: null });
    }

    return context.json({
      authenticated: true,
      user: sessionUserSchema.parse(authUserToSessionPayload(result.user)),
    });
  });

  return app;
};
