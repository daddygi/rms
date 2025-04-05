// src/db/schema.ts
import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const incidentReports = pgTable("incident_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: varchar("user_id", { length: 255 }),
  full_name: varchar("full_name", { length: 255 }),
  address: varchar("address", { length: 255 }),
  contact_number: varchar("contact_number", { length: 20 }),
  datetime: timestamp("datetime"),
  location: text("location"),
  type: varchar("type", { length: 255 }),
  description: text("description"),
  suspects: text("suspects"),
  has_witnesses: boolean("has_witnesses"),
  witness_info: text("witness_info"),
  reported_to_authorities: boolean("reported_to_authorities"),
  authorities_info: text("authorities_info"),
  damages_or_injuries: boolean("damages_or_injuries"),
  damages_description: text("damages_description"),
  has_evidence: boolean("has_evidence"),
  evidence_description: text("evidence_description"),
  preferred_action: varchar("preferred_action", { length: 255 }),
  created_at: timestamp("created_at").defaultNow(),
});
