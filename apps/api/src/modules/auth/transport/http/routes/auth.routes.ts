import {
  loginRequestSchema,
  sessionUserSchema,
} from "@smart-pump/contracts/auth";
import { Hono } from "hono";

import {
  clearSessionCookie,
  getSessionCookie,
  setSessionCookie,
} from "../../../../../shared/auth/session-cookie";
import { validate } from "../../../../../shared/http/validation";
import type { UserRepository } from "../../../../users/domain/repositories/user.repository";
import { createGetSessionUseCase } from "../../../application/use-cases/get-session.use-case";
import { createLoginUseCase } from "../../../application/use-cases/login.use-case";
import { createLogoutUseCase } from "../../../application/use-cases/logout.use-case";
import type { SessionRepository } from "../../../domain/repositories/session.repository";

interface AuthRouteDeps {
  sessions: SessionRepository;
  users: UserRepository;
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
      user: sessionUserSchema.parse(user),
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
      user: sessionUserSchema.parse(result.user),
    });
  });

  return app;
};
