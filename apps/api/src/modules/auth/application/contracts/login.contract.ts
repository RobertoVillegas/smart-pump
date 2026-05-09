import type { LoginRequest } from "@smart-pump/contracts/auth";

import type { Session } from "../../domain/entities/session.entity";
import type { AuthUserRepository } from "../../domain/repositories/auth-user.repository";
import type { SessionRepository } from "../../domain/repositories/session.repository";
import type { AuthUser } from "../../domain/types/auth-user.type";

export type LoginInput = LoginRequest;

export interface LoginOutput {
  session: Session;
  user: AuthUser;
}

export interface LoginDeps {
  sessions: SessionRepository;
  users: AuthUserRepository;
}
