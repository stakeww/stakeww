import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  minesCount: integer("mines_count").notNull(),
  // Array of grid indices (0-24) that are predicted as "safe"
  predictedSpots: jsonb("predicted_spots").notNull(), 
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPredictionSchema = createInsertSchema(predictions).omit({ id: true, createdAt: true });

export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  stakeId: text("stake_id").notNull().unique(),
  isSubscribed: boolean("is_subscribed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
