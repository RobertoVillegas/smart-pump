import type { UpdateProfileRequest } from "@smart-pump/contracts/users";

import type { UserRecord } from "../../../../db/db.types";

export interface UserRepository {
  findByEmail: (email: string) => Promise<UserRecord | undefined>;
  findById: (id: string) => Promise<UserRecord | undefined>;
  updateProfile: (
    id: string,
    profile: UpdateProfileRequest
  ) => Promise<UserRecord | undefined>;
}
