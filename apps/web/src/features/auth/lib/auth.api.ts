import type {
  LoginRequest,
  LoginResponse,
  SessionResponse,
} from "@smart-pump/contracts/auth";

import { apiRequest } from "../../../lib/api";

export const login = (body: LoginRequest) =>
  apiRequest<LoginResponse>("/auth/login", {
    body: JSON.stringify(body),
    method: "POST",
  });

export const logout = () =>
  apiRequest<{ success: boolean }>("/auth/logout", {
    method: "POST",
  });

export const getSession = () => apiRequest<SessionResponse>("/auth/session");
