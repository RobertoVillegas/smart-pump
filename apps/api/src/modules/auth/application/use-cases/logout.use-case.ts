import type { SessionRepository } from "../../domain/repositories/session.repository";

interface LogoutDeps {
  sessions: SessionRepository;
}

export const createLogoutUseCase =
  ({ sessions }: LogoutDeps) =>
  async (sessionId: string | undefined): Promise<void> => {
    if (!sessionId) {
      return;
    }

    await sessions.deleteById(sessionId);
  };
