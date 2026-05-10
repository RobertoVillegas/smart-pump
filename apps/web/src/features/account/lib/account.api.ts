import {
  balanceResponseSchema,
  changePasswordResponseSchema,
  updateProfileResponseSchema,
  userProfileResponseSchema,
} from "@smart-pump/contracts/users";
import type {
  ChangePasswordRequest,
  UpdateProfileRequest,
} from "@smart-pump/contracts/users";

import { apiRequest } from "../../../lib/api";

export const getMe = () => apiRequest("/users/me", userProfileResponseSchema);

export const getBalance = () =>
  apiRequest("/users/me/balance", balanceResponseSchema);

export const updateMe = (body: UpdateProfileRequest) =>
  apiRequest("/users/me", updateProfileResponseSchema, {
    body: JSON.stringify(body),
    method: "PATCH",
  });

export const changePassword = (body: ChangePasswordRequest) =>
  apiRequest("/users/me/password", changePasswordResponseSchema, {
    body: JSON.stringify(body),
    method: "PATCH",
  });
