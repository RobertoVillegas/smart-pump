import { Hono } from "hono";
import type { ErrorHandler } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

import type { createDb } from "./db/lowdb";
import { createDb as createDefaultDb } from "./db/lowdb";
import { createLowDbSessionRepository } from "./modules/auth/infrastructure/repositories/lowdb-session.repository";
import { createAuthRoutes } from "./modules/auth/transport/http/routes/auth.routes";
import { createLowDbUserRepository } from "./modules/users/infrastructure/repositories/lowdb-user.repository";
import { createUserRoutes } from "./modules/users/transport/http/routes/user.routes";
import { AppError } from "./shared/http/errors";

interface AppOptions {
  db?: Awaited<ReturnType<typeof createDb>>;
}

const handleError: ErrorHandler = (error, context) => {
  if (error instanceof AppError) {
    return context.json(
      {
        error: {
          message: error.message,
        },
      },
      error.statusCode
    );
  }

  return context.json(
    {
      error: {
        message: "Internal server error",
      },
    },
    500
  );
};

export const createApp = async (options: AppOptions = {}) => {
  const db = options.db ?? (await createDefaultDb());
  const sessions = createLowDbSessionRepository(db);
  const users = createLowDbUserRepository(db);
  const app = new Hono();

  const corsOrigins = process.env.CORS_ORIGINS?.split(",")
    .map((value) => value.trim())
    .filter(Boolean) ?? ["http://localhost:3000"];

  app.use(
    cors({
      credentials: true,
      origin: corsOrigins,
    })
  );
  app.use(secureHeaders());
  app.use(logger());
  app.onError(handleError);

  app.get("/", (context) =>
    context.json({
      name: "smart-pump-api",
      status: "ok",
    })
  );

  app.get("/health", (context) =>
    context.json({
      status: "ok",
    })
  );

  app.route("/auth", createAuthRoutes({ sessions, users }));
  app.route("/users", createUserRoutes({ sessions, users }));

  return app;
};

export type App = Awaited<ReturnType<typeof createApp>>;
