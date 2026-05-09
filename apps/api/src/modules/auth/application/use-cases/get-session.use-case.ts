import type {
  GetSessionDeps,
  GetSessionInput,
  GetSessionOutput,
} from "../contracts/get-session.contract";

export const createGetSessionUseCase =
  ({ sessions, users }: GetSessionDeps) =>
  async (sessionId: GetSessionInput): Promise<GetSessionOutput> => {
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
