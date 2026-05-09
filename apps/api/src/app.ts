import { Hono } from "hono";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

export const createApp = () => {
  const app = new Hono();

  app.use(secureHeaders());
  app.use(logger());

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

  return app;
};

export type App = ReturnType<typeof createApp>;
