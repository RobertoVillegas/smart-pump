import type { UpdateProfileRequest } from "@smart-pump/contracts/users";

import type { UserRecord } from "../../../../db/db.types";
import type { createDb } from "../../../../db/lowdb";
import type { User } from "../../domain/entities/user";
import type { UserRepository } from "../../domain/repositories/user.repository";

type Db = Awaited<ReturnType<typeof createDb>>;

const toUser = (record: UserRecord): User => ({
  address: record.address,
  age: record.age,
  balance: record.balance,
  company: record.company,
  email: record.email,
  eyeColor: record.eyeColor,
  firstName: record.name.first,
  id: record._id,
  isActive: record.isActive,
  lastName: record.name.last,
  password: record.password,
  phone: record.phone,
  picture: record.picture,
});

export const createLowDbUserRepository = (db: Db): UserRepository => {
  const findByEmail = async (email: string) => {
    await db.read();
    const record = db.data.users.find((user) => user.email === email);
    return record ? toUser(record) : undefined;
  };

  const findById = async (id: string) => {
    await db.read();
    const record = db.data.users.find((user) => user._id === id);
    return record ? toUser(record) : undefined;
  };

  const updateProfile = async (id: string, profile: UpdateProfileRequest) => {
    await db.read();

    const record = db.data.users.find((user) => user._id === id);

    if (!record) {
      return;
    }

    record.address = profile.address ?? record.address;
    record.age = profile.age ?? record.age;
    record.eyeColor = profile.eyeColor ?? record.eyeColor;
    record.name.first = profile.firstName ?? record.name.first;
    record.name.last = profile.lastName ?? record.name.last;
    record.phone = profile.phone ?? record.phone;

    await db.write();

    return toUser(record);
  };

  return {
    findByEmail,
    findById,
    updateProfile,
  };
};
