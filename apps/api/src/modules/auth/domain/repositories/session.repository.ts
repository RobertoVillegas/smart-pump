import type { Session } from "../entities/session.entity";

export interface CreateSessionInput {
  expiresAt: string;
  id: string;
  userId: string;
}

export interface SessionRepository {
  create: (input: CreateSessionInput) => Promise<Session>;
  deleteById: (id: string) => Promise<void>;
  findById: (id: string) => Promise<Session | undefined>;
}
