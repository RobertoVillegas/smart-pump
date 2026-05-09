import { createApp } from "./app";
import { env } from "./env";

const app = await createApp();

export default {
  fetch: app.fetch,
  port: env.PORT,
};
