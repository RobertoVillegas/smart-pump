import { createApp } from "./app";

const app = createApp();

export default {
  fetch: app.fetch,
  port: 3001,
};
