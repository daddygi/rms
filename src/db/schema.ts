import { pgTable, varchar, text, uuid, timestamp } from "drizzle-orm/pg-core";

export const incidentReports = pgTable("incident_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: varchar("user_id", { length: 255 }),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
});
