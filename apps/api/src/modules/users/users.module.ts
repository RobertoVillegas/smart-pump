import type { AppDeps } from "../../app/build-deps";
import { createLowDbAuthUserRepository } from "../auth/infrastructure/repositories/lowdb-auth-user.repository";
import { createLowDbSessionRepository } from "../auth/infrastructure/repositories/lowdb-session.repository";
import { createLowDbUserRepository } from "./infrastructure/repositories/lowdb-user.repository";
import { createUserRoutes } from "./transport/http/routes/users.routes";

export const createUsersModule = ({ db }: AppDeps) => {
  const authUsers = createLowDbAuthUserRepository(db);
  const sessions = createLowDbSessionRepository(db);
  const users = createLowDbUserRepository(db);
  const routes = createUserRoutes({ authUsers, sessions, users });

  return { routes };
};
