import type { UserRecord } from "../../../../db/db.types";
import type { User } from "../entities/user.entity";

export const recordToUser = (record: UserRecord): User => ({
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
