import type { SessionRecord } from "../../../../db/db.types";

export interface CreateSessionInput {
  expiresAt: string;
  id: string;
  userId: string;
}

export interface SessionRepository {
  create: (input: CreateSessionInput) => Promise<SessionRecord>;
  deleteById: (id: string) => Promise<void>;
  findById: (id: string) => Promise<SessionRecord | undefined>;
}
