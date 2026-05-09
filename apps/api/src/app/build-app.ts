import { Hono } from "hono";
import type { ErrorHandler } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import type { ContentfulStatusCode } from "hono/utils/http-status";

import { env } from "../env";
import { AppError } from "../shared/errors/app-error";
import { HttpError } from "../shared/http/errors";
import type { BuildDepsOptions } from "./build-deps";
import { buildDeps } from "./build-deps";
import { registerModules } from "./register-modules";

type AppOptions = BuildDepsOptions;

interface CreateAppOptions extends AppOptions {
  logger?: boolean;
}

const statusByErrorKind = {
  bad_request: 400,
  conflict: 409,
  forbidden: 403,
  not_found: 404,
  unauthorized: 401,
  validation: 422,
} as const satisfies Record<AppError["kind"], ContentfulStatusCode>;

const toHttpError = (error: Error): HttpError => {
  if (error instanceof HttpError) {
    return error;
  }

  if (error instanceof AppError) {
    return new HttpError(error.message, statusByErrorKind[error.kind], {
      cause: error,
      code: error.code,
      details: error.details,
    });
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

export const createApp = async (options: CreateAppOptions = {}) => {
  const deps = await buildDeps(options);
  const app = new Hono();

  app.use(
    cors({
      credentials: true,
      origin: env.CORS_ORIGINS,
    })
  );
  app.use(secureHeaders());
  if (options.logger ?? true) {
    app.use(logger());
  }
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
