import type { AuthUser } from "../../domain/types/auth-user.type";
import type { AuthUserRepository } from "../ports/auth-user-repository.port";
import type { SessionRepository } from "../ports/session-repository.port";

export type GetSessionInput = string | undefined;

export type GetSessionOutput =
  | { authenticated: true; user: AuthUser }
  | { authenticated: false; staleSessionId?: string; user: null };

export interface GetSessionDeps {
  sessions: SessionRepository;
  users: AuthUserRepository;
}
