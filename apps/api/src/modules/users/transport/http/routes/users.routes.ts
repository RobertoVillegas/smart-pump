import { Hono } from "hono";

import { createAuthMiddleware } from "../../../../../shared/auth/auth.middleware";
import type { AuthVariables } from "../../../../../shared/auth/auth.middleware";
import { validate } from "../../../../../shared/http/validation";
import type { AuthUserRepository } from "../../../../auth/application/ports/auth-user-repository.port";
import type { SessionRepository } from "../../../../auth/application/ports/session-repository.port";
import type { UserRepository } from "../../../application/ports/user-repository.port";
import { createChangePasswordUseCase } from "../../../application/use-cases/change-password.use-case";
import { createGetBalanceUseCase } from "../../../application/use-cases/get-balance.use-case";
import { createGetMeUseCase } from "../../../application/use-cases/get-me.use-case";
import { createUpdateMeUseCase } from "../../../application/use-cases/update-me.use-case";
import {
  changePasswordRequestSchema,
  changePasswordResponseSchema,
  updateProfileRequestSchema,
  userProfileSchema,
} from "../schemas/update-profile.schema";

interface UserRouteDeps {
  authUsers: AuthUserRepository;
  sessions: SessionRepository;
  users: UserRepository;
}

export const createUserRoutes = ({
  authUsers,
  sessions,
  users,
}: UserRouteDeps) => {
  const app = new Hono<{ Variables: AuthVariables }>();
  const requireAuth = createAuthMiddleware({
    sessions,
    users: authUsers,
  });
  const getMe = createGetMeUseCase({ users });
  const getBalance = createGetBalanceUseCase({ users });
  const updateMe = createUpdateMeUseCase({ users });
  const changePassword = createChangePasswordUseCase({ users });

  app.use("*", requireAuth);

  app.get("/me", async (context) => {
    const currentUser = context.get("user");
    const user = await getMe(currentUser.id);

    return context.json({ user: userProfileSchema.parse(user) });
  });

  app.get("/me/balance", async (context) => {
    const currentUser = context.get("user");
    const result = await getBalance(currentUser.id);

    return context.json(result);
  });

  app.patch(
    "/me",
    validate("json", updateProfileRequestSchema),
    async (context) => {
      const currentUser = context.get("user");
      const profile = context.req.valid("json");
      const user = await updateMe({ profile, userId: currentUser.id });

      return context.json({ user: userProfileSchema.parse(user) });
    }
  );

  app.patch(
    "/me/password",
    validate("json", changePasswordRequestSchema),
    async (context) => {
      const currentUser = context.get("user");
      const password = context.req.valid("json");
      const result = await changePassword({ password, userId: currentUser.id });

      return context.json(changePasswordResponseSchema.parse(result));
    }
  );

  return app;
};
