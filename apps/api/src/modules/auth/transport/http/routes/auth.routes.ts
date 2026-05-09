import { loginRequestSchema } from "@smart-pump/contracts/auth";
import { Hono } from "hono";

import {
  clearSessionCookie,
  createSessionExpiresAt,
  getSessionCookie,
  setSessionCookie,
} from "../../../../../shared/auth/session-cookie";
import { AppError } from "../../../../../shared/http/errors";
import { validate } from "../../../../../shared/http/validation";
import { createId } from "../../../../../shared/utils/ids";
import { toSessionUser } from "../../../../users/domain/mappers/user.mapper";
import type { UserRepository } from "../../../../users/domain/repositories/user.repository";
import type { SessionRepository } from "../../../domain/repositories/session.repository";

interface AuthRouteDeps {
  sessions: SessionRepository;
  users: UserRepository;
}

export const createAuthRoutes = ({ sessions, users }: AuthRouteDeps) => {
  const app = new Hono();

  app.post("/login", validate("json", loginRequestSchema), async (context) => {
    const credentials = context.req.valid("json");
    const user = await users.findByEmail(credentials.email);

    if (!user || user.password !== credentials.password) {
      throw new AppError("Invalid email or password", 401);
    }

    if (!user.isActive) {
      throw new AppError("User account is inactive", 403);
    }

    const session = await sessions.create({
      expiresAt: createSessionExpiresAt().toISOString(),
      id: createId(),
      userId: user._id,
    });

    setSessionCookie(context, session.id);

    return context.json({
      user: toSessionUser(user),
    });
  });

  app.post("/logout", async (context) => {
    const sessionId = getSessionCookie(context);

    if (sessionId) {
      await sessions.deleteById(sessionId);
    }

    clearSessionCookie(context);

    return context.json({
      success: true,
    });
  });

  app.get("/session", async (context) => {
    const sessionId = getSessionCookie(context);

    if (!sessionId) {
      return context.json({
        authenticated: false,
        user: null,
      });
    }

    const session = await sessions.findById(sessionId);

    if (!session || new Date(session.expiresAt) <= new Date()) {
      if (session) {
        await sessions.deleteById(session.id);
      }

      clearSessionCookie(context);

      return context.json({
        authenticated: false,
        user: null,
      });
    }

    const user = await users.findById(session.userId);

    if (!user || !user.isActive) {
      clearSessionCookie(context);

      return context.json({
        authenticated: false,
        user: null,
      });
    }

    return context.json({
      authenticated: true,
      user: toSessionUser(user),
    });
  });

  return app;
};
