import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { JSONFilePreset } from "lowdb/node";
import { beforeEach, describe, expect, it } from "vitest";

import { createApp } from "../src/app";
import type { DbShape } from "../src/db/db.types";

type JsonObject = Record<string, unknown>;

const activeUser = {
  _id: "active-user-id",
  address: "121 National Drive",
  age: 30,
  balance: "$3,585.69",
  company: "GEEKNET",
  email: "henderson.briggs@geeknet.net",
  eyeColor: "blue",
  guid: "active-user-guid",
  isActive: true,
  name: {
    first: "Henderson",
    last: "Briggs",
  },
  password: "23derd*334",
  phone: "+1 (936) 451-3590",
  picture: "http://placehold.it/32x32",
};

const inactiveUser = {
  ...activeUser,
  _id: "inactive-user-id",
  email: "boyd.small@endipine.biz",
  isActive: false,
  password: "_4rhododfj",
};

const createTestApp = async () => {
  const directory = await mkdtemp(join(tmpdir(), "smart-pump-api-"));
  const path = join(directory, `${crypto.randomUUID()}.json`);
  const seedData: DbShape = {
    sessions: [],
    users: [activeUser, inactiveUser],
  };

  await writeFile(path, JSON.stringify(seedData), "utf-8");

  const db = await JSONFilePreset<DbShape>(path, seedData);
  const app = await createApp({ db });

  return app;
};

const login = (app: Awaited<ReturnType<typeof createTestApp>>) =>
  app.request("/auth/login", {
    body: JSON.stringify({
      email: activeUser.email,
      password: activeUser.password,
    }),
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
  });

describe("API", () => {
  let app: Awaited<ReturnType<typeof createTestApp>>;

  beforeEach(async () => {
    app = await createTestApp();
  });

  it("logs in an active user and sets a session cookie", async () => {
    const response = await login(app);
    const body = (await response.json()) as JsonObject;
    const user = body.user as JsonObject;

    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toContain("smart_pump_session");
    expect(user).toMatchObject({
      email: activeUser.email,
      firstName: activeUser.name.first,
      id: activeUser._id,
      lastName: activeUser.name.last,
    });
    expect(user.password).toBeUndefined();
  });

  it("rejects inactive user login", async () => {
    const response = await app.request("/auth/login", {
      body: JSON.stringify({
        email: inactiveUser.email,
        password: inactiveUser.password,
      }),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    });

    expect(response.status).toBe(403);
  });

  it("protects current user routes", async () => {
    const response = await app.request("/users/me");

    expect(response.status).toBe(401);
  });

  it("returns the authenticated user balance", async () => {
    const loginResponse = await login(app);
    const cookie = loginResponse.headers.get("set-cookie") ?? "";
    const response = await app.request("/users/me/balance", {
      headers: {
        cookie,
      },
    });
    const body = (await response.json()) as JsonObject;

    expect(response.status).toBe(200);
    expect(body).toStrictEqual({
      balance: activeUser.balance,
    });
  });

  it("updates editable profile fields and rejects protected fields", async () => {
    const loginResponse = await login(app);
    const cookie = loginResponse.headers.get("set-cookie") ?? "";
    const response = await app.request("/users/me", {
      body: JSON.stringify({
        balance: "$0.00",
        firstName: "Updated",
      }),
      headers: {
        "content-type": "application/json",
        cookie,
      },
      method: "PATCH",
    });

    expect(response.status).toBe(400);

    const validResponse = await app.request("/users/me", {
      body: JSON.stringify({
        firstName: "Updated",
        phone: "+1 (555) 000-0000",
      }),
      headers: {
        "content-type": "application/json",
        cookie,
      },
      method: "PATCH",
    });
    const body = (await validResponse.json()) as JsonObject;
    const user = body.user as JsonObject;

    expect(validResponse.status).toBe(200);
    expect(user.firstName).toBe("Updated");
    expect(user.phone).toBe("+1 (555) 000-0000");
    expect(user.balance).toBeUndefined();
  });
});
