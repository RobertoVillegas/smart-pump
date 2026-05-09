import { Hono } from "hono";
import type { ErrorHandler } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

import { InactiveUserError } from "../modules/auth/domain/errors/inactive-user.error";
import { InvalidCredentialsError } from "../modules/auth/domain/errors/invalid-credentials.error";
import { UnauthorizedError } from "../modules/auth/domain/errors/unauthorized.error";
import { ForbiddenProfileUpdateError } from "../modules/users/domain/errors/forbidden-profile-update.error";
import { UserNotFoundError } from "../modules/users/domain/errors/user-not-found.error";
import { HttpError } from "../shared/http/errors";
import type { BuildDepsOptions } from "./build-deps";
import { buildDeps } from "./build-deps";
import { registerModules } from "./register-modules";

type AppOptions = BuildDepsOptions;

const toHttpError = (error: Error): HttpError => {
  if (error instanceof InvalidCredentialsError) {
    return new HttpError(error.message, 401);
  }

  if (error instanceof InactiveUserError) {
    return new HttpError(error.message, 403);
  }

  if (error instanceof UnauthorizedError) {
    return new HttpError(error.message, 401);
  }

  if (error instanceof ForbiddenProfileUpdateError) {
    return new HttpError(error.message, 403);
  }

  if (error instanceof UserNotFoundError) {
    return new HttpError(error.message, 404);
  }

  if (error instanceof HttpError) {
    return error;
  }

  return new HttpError("Internal server error", 500);
};

const handleError: ErrorHandler = (error, context) => {
  const httpError = toHttpError(error);

  return context.json(
    {
      error: {
        message: httpError.message,
      },
    },
    httpError.statusCode
  );
};

export const createApp = async (options: AppOptions = {}) => {
  const deps = await buildDeps(options);
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

  registerModules(app, deps);

  return app;
};

export type App = Awaited<ReturnType<typeof createApp>>;
