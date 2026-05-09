import type { LogoutDeps, LogoutInput } from "../contracts/logout.contract";

export const createLogoutUseCase =
  ({ sessions }: LogoutDeps) =>
  async (sessionId: LogoutInput) => {
    if (!sessionId) {
      return;
    }

    await sessions.deleteById(sessionId);
  };
