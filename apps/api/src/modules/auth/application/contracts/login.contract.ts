import type { Session } from "../../domain/entities/session.entity";
import type { AuthUser } from "../../domain/types/auth-user.type";
import type { AuthUserRepository } from "../ports/auth-user-repository.port";
import type { SessionRepository } from "../ports/session-repository.port";

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  session: Session;
  user: AuthUser;
}

export interface LoginDeps {
  sessions: SessionRepository;
  users: AuthUserRepository;
}
