import type { User } from "../../domain/entities/user.entity";
import type { UserRepository } from "../../domain/repositories/user.repository";
import type { EditableUserFields } from "../../domain/types/editable-user-fields.type";

export interface UpdateMeInput {
  userId: string;
  profile: EditableUserFields;
}

export type UpdateMeOutput = User;

export interface UpdateMeDeps {
  users: UserRepository;
}
