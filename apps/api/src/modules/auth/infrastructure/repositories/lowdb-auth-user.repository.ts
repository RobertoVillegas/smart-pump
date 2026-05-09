import type { UserRecord } from "../../../../db/db.types";
import type { createDb } from "../../../../db/lowdb";
import type { AuthUserRepository } from "../../domain/repositories/auth-user.repository";
import type { AuthUser } from "../../domain/types/auth-user.type";

type Db = Awaited<ReturnType<typeof createDb>>;

const recordToAuthUser = (record: UserRecord): AuthUser => ({
  email: record.email,
  firstName: record.name.first,
  id: record._id,
  isActive: record.isActive,
  lastName: record.name.last,
  password: record.password,
});

export const createLowDbAuthUserRepository = (db: Db): AuthUserRepository => ({
  findByEmail: async (email) => {
    await db.read();
    const record = db.data.users.find((user) => user.email === email);
    return record ? recordToAuthUser(record) : undefined;
  },
  findById: async (id) => {
    await db.read();
    const record = db.data.users.find((user) => user._id === id);
    return record ? recordToAuthUser(record) : undefined;
  },
});
