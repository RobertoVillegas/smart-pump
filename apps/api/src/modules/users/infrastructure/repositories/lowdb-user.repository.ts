import type { UpdateProfileRequest } from "@smart-pump/contracts/users";

import type { createDb } from "../../../../db/lowdb";
import type { UserRepository } from "../../domain/repositories/user.repository";

type Db = Awaited<ReturnType<typeof createDb>>;

export const createLowDbUserRepository = (db: Db): UserRepository => {
  const findByEmail = async (email: string) => {
    await db.read();

    return db.data.users.find((user) => user.email === email);
  };

  const findById = async (id: string) => {
    await db.read();

    return db.data.users.find((user) => user._id === id);
  };

  const updateProfile = async (id: string, profile: UpdateProfileRequest) => {
    await db.read();

    const user = db.data.users.find((record) => record._id === id);

    if (!user) {
      return;
    }

    user.address = profile.address ?? user.address;
    user.age = profile.age ?? user.age;
    user.eyeColor = profile.eyeColor ?? user.eyeColor;
    user.name.first = profile.firstName ?? user.name.first;
    user.name.last = profile.lastName ?? user.name.last;
    user.phone = profile.phone ?? user.phone;

    await db.write();

    return user;
  };

  return {
    findByEmail,
    findById,
    updateProfile,
  };
};
