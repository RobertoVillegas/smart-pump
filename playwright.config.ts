import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

import { defineConfig, devices } from "@playwright/test";

const rootDir = import.meta.dirname;

const apiPort = 3101;
const webPort = 3100;
const apiUrl = `http://localhost:${apiPort}`;
const webUrl = `http://localhost:${webPort}`;

const seedSource = resolve(rootDir, "data/users.json");
const testDataDir = resolve(rootDir, ".playwright/data");
const testDbPath = resolve(testDataDir, "users.test.json");

mkdirSync(testDataDir, { recursive: true });
copyFileSync(seedSource, testDbPath);

export default defineConfig({
  fullyParallel: false,
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"] },
    },
  ],
  reporter: [["list"]],
  retries: process.env.CI ? 1 : 0,
  testDir: "./e2e",
  use: {
    baseURL: webUrl,
    trace: "retain-on-failure",
  },
  webServer: [
    {
      command: `bun run --cwd apps/api start`,
      env: {
        CORS_ORIGINS: webUrl,
        LOWDB_PATH: testDbPath,
        PORT: String(apiPort),
      },
      reuseExistingServer: false,
      timeout: 60_000,
      url: `${apiUrl}/health`,
    },
    {
      command: `bun run --cwd apps/web dev:port --port ${webPort}`,
      env: {
        VITE_API_URL: apiUrl,
      },
      reuseExistingServer: false,
      timeout: 120_000,
      url: webUrl,
    },
  ],
  workers: 1,
});
