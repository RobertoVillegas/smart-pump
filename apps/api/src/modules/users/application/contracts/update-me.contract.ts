import type { User } from "../../domain/entities/user.entity";
import type { EditableUserFields } from "../../domain/types/editable-user-fields.type";
import type { UserRepository } from "../ports/user-repository.port";

export interface UpdateMeInput {
  userId: string;
  profile: EditableUserFields;
}

export type UpdateMeOutput = User;

export interface UpdateMeDeps {
  users: UserRepository;
}
