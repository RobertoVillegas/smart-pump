import { createApp } from "./app";

const app = await createApp();

export default {
  fetch: app.fetch,
  port: Number(process.env.PORT ?? 3001),
};
