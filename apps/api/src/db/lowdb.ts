import { resolve } from "node:path";

import { JSONFilePreset } from "lowdb/node";

import type { DbShape } from "./db.types";

const currentDirectory = import.meta.dirname;
const dataFilePath = process.env.LOWDB_PATH
  ? resolve(process.env.LOWDB_PATH)
  : resolve(currentDirectory, "../../../../data/users.json");

const defaultData: DbShape = {
  sessions: [],
  users: [],
};

export const createDb = async () => {
  const db = await JSONFilePreset<DbShape>(dataFilePath, defaultData);
  return db;
};
