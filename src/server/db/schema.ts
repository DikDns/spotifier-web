// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator(
  (name) => `spotifier-web_${name}`,
);

export const users = createTable(
  "user",
  {
    id: text("id", { length: 256 }).primaryKey(),
    name: text("name", { length: 256 }),
    nim: text("nim", { length: 256 }),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  },
  (user) => ({
    nameIndex: index("name_idx").on(user.name),
    nimIndex: index("nim_idx").on(user.nim),
  }),
);

export type User = typeof users.$inferSelect;
