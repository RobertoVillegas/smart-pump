import type { UpdateProfileRequest } from "@smart-pump/contracts/users";

import type { User } from "../entities/user";

export interface UserRepository {
  findByEmail: (email: string) => Promise<User | undefined>;
  findById: (id: string) => Promise<User | undefined>;
  updateProfile: (
    id: string,
    profile: UpdateProfileRequest
  ) => Promise<User | undefined>;
}
