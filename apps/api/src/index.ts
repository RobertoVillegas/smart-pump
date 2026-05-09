import { createApp } from "./app";

const app = await createApp();

export default {
  fetch: app.fetch,
  port: 3001,
};
