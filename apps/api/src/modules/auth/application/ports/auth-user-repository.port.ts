import type { AuthUser } from "../../domain/types/auth-user.type";

export interface AuthUserRepository {
  findByEmail: (email: string) => Promise<AuthUser | undefined>;
  findById: (id: string) => Promise<AuthUser | undefined>;
}
