import type { SessionRepository } from "../../domain/repositories/session.repository";

export type LogoutInput = string | undefined;

export interface LogoutDeps {
  sessions: SessionRepository;
}
