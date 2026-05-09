import type { SessionUser } from "@smart-pump/contracts/auth";
import type { UserProfile } from "@smart-pump/contracts/users";

import type { UserRecord } from "../../../../db/db.types";

export const toSessionUser = (user: UserRecord): SessionUser => ({
  email: user.email,
  firstName: user.name.first,
  id: user._id,
  isActive: user.isActive,
  lastName: user.name.last,
});

export const toUserProfile = (user: UserRecord): UserProfile => ({
  address: user.address,
  age: user.age,
  company: user.company,
  email: user.email,
  eyeColor: user.eyeColor,
  firstName: user.name.first,
  id: user._id,
  isActive: user.isActive,
  lastName: user.name.last,
  phone: user.phone,
  picture: user.picture,
});
