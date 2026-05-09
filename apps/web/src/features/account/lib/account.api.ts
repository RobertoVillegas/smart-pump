import type {
  BalanceResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UserProfileResponse,
} from "@smart-pump/contracts/users";

import { apiRequest } from "../../../lib/api";

export const getMe = () => apiRequest<UserProfileResponse>("/users/me");

export const getBalance = () =>
  apiRequest<BalanceResponse>("/users/me/balance");

export const updateMe = (body: UpdateProfileRequest) =>
  apiRequest<UpdateProfileResponse>("/users/me", {
    body: JSON.stringify(body),
    method: "PATCH",
  });
