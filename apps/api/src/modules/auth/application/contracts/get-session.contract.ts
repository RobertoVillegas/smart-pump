import type { AuthUserRepository } from "../../domain/repositories/auth-user.repository";
import type { SessionRepository } from "../../domain/repositories/session.repository";
import type { AuthUser } from "../../domain/types/auth-user.type";

export type GetSessionInput = string | undefined;

export type GetSessionOutput =
  | { authenticated: true; user: AuthUser }
  | { authenticated: false; staleSessionId?: string; user: null };

export interface GetSessionDeps {
  sessions: SessionRepository;
  users: AuthUserRepository;
}
