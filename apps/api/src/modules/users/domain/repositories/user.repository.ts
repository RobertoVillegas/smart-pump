import type { User } from "../entities/user.entity";
import type { EditableUserFields } from "../types/editable-user-fields.type";

export interface UserRepository {
  findById: (id: string) => Promise<User | undefined>;
  updateProfile: (
    id: string,
    profile: EditableUserFields
  ) => Promise<User | undefined>;
}
