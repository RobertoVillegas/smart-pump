import type { createDb } from "../db/lowdb";
import { createDb as createDefaultDb } from "../db/lowdb";

export interface AppDeps {
  db: Awaited<ReturnType<typeof createDb>>;
}

export interface BuildDepsOptions {
  db?: AppDeps["db"];
}

export const buildDeps = async (
  options: BuildDepsOptions = {}
): Promise<AppDeps> => ({
  db: options.db ?? (await createDefaultDb()),
});
