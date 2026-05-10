import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  loginResponseSchema,
  sessionResponseSchema,
} from "@smart-pump/contracts/auth";
import {
  balanceResponseSchema,
  changePasswordResponseSchema,
  userProfileResponseSchema,
} from "@smart-pump/contracts/users";
import { JSONFilePreset } from "lowdb/node";
import { beforeEach, describe, expect, it } from "vitest";
import { z } from "zod";

import { createApp } from "../src/app";
import type { DbShape } from "../src/db/db.types";

const errorResponseSchema = z.object({
  error: z.object({
    message: z.string(),
  }),
});

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

const otherActiveUser = {
  ...activeUser,
  _id: "other-active-user-id",
  email: "other.user@smartpump.test",
  guid: "other-active-user-guid",
};

const createTestApp = async () => {
  const directory = await mkdtemp(join(tmpdir(), "smart-pump-api-"));
  const path = join(directory, `${crypto.randomUUID()}.json`);
  const seedData: DbShape = {
    sessions: [],
    users: structuredClone([activeUser, inactiveUser, otherActiveUser]),
  };

  await writeFile(path, JSON.stringify(seedData), "utf-8");

  const db = await JSONFilePreset<DbShape>(path, seedData);
  const app = await createApp({ db, logger: false });

  return { app, db };
};

type TestContext = Awaited<ReturnType<typeof createTestApp>>;

const login = ({ app }: TestContext) =>
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
  let context: TestContext;

  beforeEach(async () => {
    context = await createTestApp();
  });

  it("logs in an active user and sets a session cookie", async () => {
    const response = await login(context);
    const body = loginResponseSchema.parse(await response.json());

    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toContain("smart_pump_session");
    expect(body.user).toMatchObject({
      email: activeUser.email,
      firstName: activeUser.name.first,
      id: activeUser._id,
      lastName: activeUser.name.last,
    });
    expect("password" in body.user).toBeFalsy();
  });

  it("rejects inactive user login", async () => {
    const response = await context.app.request("/auth/login", {
      body: JSON.stringify({
        email: inactiveUser.email,
        password: inactiveUser.password,
      }),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    });
    const body = errorResponseSchema.parse(await response.json());

    expect(response.status).toBe(403);
    expect(body.error.message).toBe("User account is inactive");
    expect("details" in body.error).toBeFalsy();
  });

  it("protects current user routes", async () => {
    const response = await context.app.request("/users/me");
    const body = errorResponseSchema.parse(await response.json());

    expect(response.status).toBe(401);
    expect(body.error.message).toBe("Authentication required");
  });

  it("returns the authenticated user balance", async () => {
    const loginResponse = await login(context);
    const cookie = loginResponse.headers.get("set-cookie") ?? "";
    const response = await context.app.request("/users/me/balance", {
      headers: {
        cookie,
      },
    });
    const body = balanceResponseSchema.parse(await response.json());

    expect(response.status).toBe(200);
    expect(body).toStrictEqual({
      balance: activeUser.balance,
    });
  });

  it("rejects protected profile fields", async () => {
    const loginResponse = await login(context);
    const cookie = loginResponse.headers.get("set-cookie") ?? "";
    const response = await context.app.request("/users/me", {
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
    const errorBody = errorResponseSchema.parse(await response.json());

    expect(response.status).toBe(400);
    expect(errorBody.error.message).toBe("Invalid request body");
  });

  it("updates editable profile fields", async () => {
    const loginResponse = await login(context);
    const cookie = loginResponse.headers.get("set-cookie") ?? "";

    const validResponse = await context.app.request("/users/me", {
      body: JSON.stringify({
        email: "updated.user@smartpump.test",
        firstName: "Updated",
        phone: "+1 (213) 373-4253",
      }),
      headers: {
        "content-type": "application/json",
        cookie,
      },
      method: "PATCH",
    });
    const body = userProfileResponseSchema.parse(await validResponse.json());

    expect(validResponse.status).toBe(200);
    expect(body.user.email).toBe("updated.user@smartpump.test");
    expect(body.user.firstName).toBe("Updated");
    expect(body.user.phone).toBe("+1 (213) 373-4253");
    expect("balance" in body.user).toBeFalsy();
  });

  it("rejects duplicate profile email updates", async () => {
    const loginResponse = await login(context);
    const cookie = loginResponse.headers.get("set-cookie") ?? "";
    const response = await context.app.request("/users/me", {
      body: JSON.stringify({
        email: otherActiveUser.email,
      }),
      headers: {
        "content-type": "application/json",
        cookie,
      },
      method: "PATCH",
    });
    const body = errorResponseSchema.parse(await response.json());

    expect(response.status).toBe(409);
    expect(body.error.message).toBe("Email is already in use");
  });

  it("changes the authenticated user password", async () => {
    const loginResponse = await login(context);
    const cookie = loginResponse.headers.get("set-cookie") ?? "";
    const response = await context.app.request("/users/me/password", {
      body: JSON.stringify({
        confirmPassword: "new-password",
        currentPassword: activeUser.password,
        newPassword: "new-password",
      }),
      headers: {
        "content-type": "application/json",
        cookie,
      },
      method: "PATCH",
    });
    const body = changePasswordResponseSchema.parse(await response.json());

    expect(response.status).toBe(200);
    expect(body).toStrictEqual({ success: true });

    const oldPasswordResponse = await context.app.request("/auth/login", {
      body: JSON.stringify({
        email: activeUser.email,
        password: activeUser.password,
      }),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    });
    const newPasswordResponse = await context.app.request("/auth/login", {
      body: JSON.stringify({
        email: activeUser.email,
        password: "new-password",
      }),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    });

    expect(oldPasswordResponse.status).toBe(401);
    expect(newPasswordResponse.status).toBe(200);
  });

  it("rejects password changes with an invalid current password", async () => {
    const loginResponse = await login(context);
    const cookie = loginResponse.headers.get("set-cookie") ?? "";
    const response = await context.app.request("/users/me/password", {
      body: JSON.stringify({
        confirmPassword: "new-password",
        currentPassword: "wrong-password",
        newPassword: "new-password",
      }),
      headers: {
        "content-type": "application/json",
        cookie,
      },
      method: "PATCH",
    });
    const body = errorResponseSchema.parse(await response.json());

    expect(response.status).toBe(403);
    expect(body.error.message).toBe("Current password is incorrect");
  });

  it("reports the current session and clears stale sessions", async () => {
    const loginResponse = await login(context);
    const cookie = loginResponse.headers.get("set-cookie") ?? "";
    const sessionResponse = await context.app.request("/auth/session", {
      headers: {
        cookie,
      },
    });
    const sessionBody = sessionResponseSchema.parse(
      await sessionResponse.json()
    );

    expect(sessionBody.authenticated).toBeTruthy();
    expect(sessionBody.user?.id).toBe(activeUser._id);

    context.db.data.sessions[0].expiresAt = new Date(0).toISOString();
    await context.db.write();

    const staleResponse = await context.app.request("/auth/session", {
      headers: {
        cookie,
      },
    });
    const staleBody = sessionResponseSchema.parse(await staleResponse.json());

    expect(staleResponse.headers.get("set-cookie")).toContain(
      "smart_pump_session="
    );
    expect(staleBody).toStrictEqual({
      authenticated: false,
      user: null,
    });
  });

  it("logs out and invalidates the session", async () => {
    const loginResponse = await login(context);
    const cookie = loginResponse.headers.get("set-cookie") ?? "";
    const logoutResponse = await context.app.request("/auth/logout", {
      headers: {
        cookie,
      },
      method: "POST",
    });
    const sessionResponse = await context.app.request("/users/me", {
      headers: {
        cookie,
      },
    });

    await expect(logoutResponse.json()).resolves.toStrictEqual({
      success: true,
    });
    expect(sessionResponse.status).toBe(401);
  });
});
