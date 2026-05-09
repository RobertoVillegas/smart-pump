import { updateProfileRequestSchema } from "@smart-pump/contracts/users";
import { Hono } from "hono";

import { createAuthMiddleware } from "../../../../../shared/auth/auth.middleware";
import type { AuthVariables } from "../../../../../shared/auth/auth.middleware";
import { AppError } from "../../../../../shared/http/errors";
import { validate } from "../../../../../shared/http/validation";
import type { SessionRepository } from "../../../../auth/domain/repositories/session.repository";
import { toUserProfile } from "../../../domain/mappers/user.mapper";
import type { UserRepository } from "../../../domain/repositories/user.repository";

interface UserRouteDeps {
  sessions: SessionRepository;
  users: UserRepository;
}

export const createUserRoutes = ({ sessions, users }: UserRouteDeps) => {
  const app = new Hono<{ Variables: AuthVariables }>();
  const requireAuth = createAuthMiddleware({ sessions, users });

  app.use("*", requireAuth);

  app.get("/me", async (context) => {
    const currentUser = context.get("user");
    const user = await users.findById(currentUser.id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return context.json({
      user: toUserProfile(user),
    });
  });

  app.get("/me/balance", async (context) => {
    const currentUser = context.get("user");
    const user = await users.findById(currentUser.id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return context.json({
      balance: user.balance,
    });
  });

  app.patch(
    "/me",
    validate("json", updateProfileRequestSchema),
    async (context) => {
      const currentUser = context.get("user");
      const profile = context.req.valid("json");
      const user = await users.updateProfile(currentUser.id, profile);

      if (!user) {
        throw new AppError("User not found", 404);
      }

      return context.json({
        user: toUserProfile(user),
      });
    }
  );

  return app;
};
