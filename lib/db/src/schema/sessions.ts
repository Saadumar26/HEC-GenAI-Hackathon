import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const generationSessionsTable = pgTable("generation_sessions", {
  id: serial("id").primaryKey(),
  brandName: text("brand_name").notNull(),
  intent: text("intent").notNull(),
  platforms: jsonb("platforms").$type<string[]>().notNull(),
  brandProfile: jsonb("brand_profile").notNull(),
  contentBrief: jsonb("content_brief").notNull(),
  posts: jsonb("posts").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGenerationSessionSchema = createInsertSchema(
  generationSessionsTable,
).omit({ id: true, createdAt: true });

export type InsertGenerationSession = z.infer<typeof insertGenerationSessionSchema>;
export type GenerationSession = typeof generationSessionsTable.$inferSelect;
