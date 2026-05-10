import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

import { env } from "../../env";

export const sessionCookieName = "smart_pump_session";

const sessionDurationMs = 1000 * 60 * 60;

export const createSessionExpiresAt = () =>
  new Date(Date.now() + sessionDurationMs);

export const getSessionCookie = (context: Context) =>
  getCookie(context, sessionCookieName);

export const setSessionCookie = (context: Context, sessionId: string) => {
  setCookie(context, sessionCookieName, sessionId, {
    expires: createSessionExpiresAt(),
    httpOnly: true,
    path: "/",
    sameSite: "Lax",
    secure: env.NODE_ENV === "production",
  });
};

export const clearSessionCookie = (context: Context) => {
  deleteCookie(context, sessionCookieName, {
    httpOnly: true,
    path: "/",
    sameSite: "Lax",
    secure: env.NODE_ENV === "production",
  });
};
