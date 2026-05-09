import type { User } from "../../domain/entities/user.entity";
import type { EditableUserFields } from "../../domain/types/editable-user-fields.type";

export interface UserRepository {
  findById: (id: string) => Promise<User | undefined>;
  updateProfile: (
    id: string,
    profile: EditableUserFields
  ) => Promise<User | undefined>;
}
