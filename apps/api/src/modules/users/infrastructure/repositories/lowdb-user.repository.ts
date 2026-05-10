import type { createDb } from "../../../../db/lowdb";
import type { UserRepository } from "../../application/ports/user-repository.port";
import { recordToUser } from "../../domain/mappers/user.mapper";
import type { EditableUserFields } from "../../domain/types/editable-user-fields.type";

type Db = Awaited<ReturnType<typeof createDb>>;

export const createLowDbUserRepository = (db: Db): UserRepository => ({
  findByEmail: async (email) => {
    await db.read();
    const record = db.data.users.find((user) => user.email === email);
    return record ? recordToUser(record) : undefined;
  },
  findById: async (id) => {
    await db.read();
    const record = db.data.users.find((user) => user._id === id);
    return record ? recordToUser(record) : undefined;
  },
  updatePassword: async (id, password) => {
    await db.read();

    const record = db.data.users.find((user) => user._id === id);

    if (!record) {
      return;
    }

    record.password = password;

    await db.write();

    return recordToUser(record);
  },
  updateProfile: async (id, profile: EditableUserFields) => {
    await db.read();

    const record = db.data.users.find((user) => user._id === id);

    if (!record) {
      return;
    }

    record.address = profile.address ?? record.address;
    record.age = profile.age ?? record.age;
    record.email = profile.email ?? record.email;
    record.eyeColor = profile.eyeColor ?? record.eyeColor;
    record.name.first = profile.firstName ?? record.name.first;
    record.name.last = profile.lastName ?? record.name.last;
    record.phone = profile.phone ?? record.phone;

    await db.write();

    return recordToUser(record);
  },
});
