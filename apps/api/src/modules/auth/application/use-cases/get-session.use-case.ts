import type { User } from "../../../users/domain/entities/user";
import type { UserRepository } from "../../../users/domain/repositories/user.repository";
import type { SessionRepository } from "../../domain/repositories/session.repository";

interface GetSessionDeps {
  sessions: SessionRepository;
  users: UserRepository;
}

export type GetSessionResult =
  | { authenticated: true; user: User }
  | { authenticated: false; user: null; staleSessionId?: string };

export const createGetSessionUseCase =
  ({ sessions, users }: GetSessionDeps) =>
  async (sessionId: string | undefined): Promise<GetSessionResult> => {
    if (!sessionId) {
      return { authenticated: false, user: null };
    }

    const session = await sessions.findById(sessionId);

    if (!session || new Date(session.expiresAt) <= new Date()) {
      if (session) {
        await sessions.deleteById(session.id);
      }
      return { authenticated: false, staleSessionId: sessionId, user: null };
    }

    const user = await users.findById(session.userId);

    if (!user || !user.isActive) {
      return { authenticated: false, staleSessionId: sessionId, user: null };
    }

    return { authenticated: true, user };
  };
