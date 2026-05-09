import {
  loginResponseSchema,
  sessionResponseSchema,
} from "@smart-pump/contracts/auth";
import type { LoginRequest } from "@smart-pump/contracts/auth";
import { z } from "zod";

import { apiRequest } from "../../../lib/api";

const logoutResponseSchema = z.object({
  success: z.boolean(),
});

export const login = (body: LoginRequest) =>
  apiRequest("/auth/login", loginResponseSchema, {
    body: JSON.stringify(body),
    method: "POST",
  });

export const logout = () =>
  apiRequest("/auth/logout", logoutResponseSchema, {
    method: "POST",
  });

export const getSession = () =>
  apiRequest("/auth/session", sessionResponseSchema);
