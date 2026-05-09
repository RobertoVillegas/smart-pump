import type { AppDeps } from "../../app/build-deps";
import { createLowDbAuthUserRepository } from "./infrastructure/repositories/lowdb-auth-user.repository";
import { createLowDbSessionRepository } from "./infrastructure/repositories/lowdb-session.repository";
import { createAuthRoutes } from "./transport/http/routes/auth.routes";

export const createAuthModule = ({ db }: AppDeps) => {
  const sessions = createLowDbSessionRepository(db);
  const users = createLowDbAuthUserRepository(db);
  const routes = createAuthRoutes({ sessions, users });

  return { routes };
};
