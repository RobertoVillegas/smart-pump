import type { SessionRecord } from "../../../../db/db.types";
import type { Session } from "../entities/session.entity";
import type { AuthUser } from "../types/auth-user.type";
import type { SessionPayload } from "../types/session-payload.type";

export const recordToSession = (record: SessionRecord): Session => ({
  createdAt: record.createdAt,
  expiresAt: record.expiresAt,
  id: record.id,
  userId: record.userId,
});

export const authUserToSessionPayload = (user: AuthUser): SessionPayload => ({
  email: user.email,
  firstName: user.firstName,
  id: user.id,
  isActive: user.isActive,
  lastName: user.lastName,
});
