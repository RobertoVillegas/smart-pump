import type { createDb } from "../../../../db/lowdb";
import type {
  CreateSessionInput,
  SessionRepository,
} from "../../application/ports/session-repository.port";
import { recordToSession } from "../../domain/mappers/session.mapper";

type Db = Awaited<ReturnType<typeof createDb>>;

export const createLowDbSessionRepository = (db: Db): SessionRepository => ({
  create: async (input: CreateSessionInput) => {
    await db.read();

    const record = {
      createdAt: new Date().toISOString(),
      expiresAt: input.expiresAt,
      id: input.id,
      userId: input.userId,
    };

    db.data.sessions.push(record);
    await db.write();

    return recordToSession(record);
  },
  deleteById: async (id) => {
    await db.read();
    db.data.sessions = db.data.sessions.filter((session) => session.id !== id);
    await db.write();
  },
  findById: async (id) => {
    await db.read();
    const record = db.data.sessions.find((session) => session.id === id);
    return record ? recordToSession(record) : undefined;
  },
});
