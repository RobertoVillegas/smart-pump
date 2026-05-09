import type { createDb } from "../../../../db/lowdb";
import type {
  CreateSessionInput,
  SessionRepository,
} from "../../domain/repositories/session.repository";

type Db = Awaited<ReturnType<typeof createDb>>;

export const createLowDbSessionRepository = (db: Db): SessionRepository => {
  const create = async (input: CreateSessionInput) => {
    await db.read();

    const session = {
      createdAt: new Date().toISOString(),
      expiresAt: input.expiresAt,
      id: input.id,
      userId: input.userId,
    };

    db.data.sessions.push(session);
    await db.write();

    return session;
  };

  const deleteById = async (id: string) => {
    await db.read();

    db.data.sessions = db.data.sessions.filter((session) => session.id !== id);
    await db.write();
  };

  const findById = async (id: string) => {
    await db.read();

    return db.data.sessions.find((session) => session.id === id);
  };

  return {
    create,
    deleteById,
    findById,
  };
};
