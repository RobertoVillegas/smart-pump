import type { Hono } from "hono";

import { createAuthModule } from "../modules/auth/auth.module";
import { createUsersModule } from "../modules/users/users.module";
import type { AppDeps } from "./build-deps";

export const registerModules = (app: Hono, deps: AppDeps) => {
  const auth = createAuthModule(deps);
  const users = createUsersModule(deps);

  app.route("/auth", auth.routes);
  app.route("/users", users.routes);
};
