import type { SessionRepository } from "../ports/session-repository.port";

export type LogoutInput = string | undefined;

export interface LogoutDeps {
  sessions: SessionRepository;
}
