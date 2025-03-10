import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const androidUiElements = pgTable("android_ui_elements", {
  id: serial("id").primaryKey(),
  xmlContent: text("xml_content").notNull(),
  parsedElements: jsonb("parsed_elements").notNull(),
  screenWidth: integer("screen_width").notNull(),
  screenHeight: integer("screen_height").notNull(),
});

export const insertAndroidUiSchema = createInsertSchema(androidUiElements).pick({
  xmlContent: true,
  parsedElements: true,
  screenWidth: true,
  screenHeight: true,
});

export type InsertAndroidUi = z.infer<typeof insertAndroidUiSchema>;
export type AndroidUi = typeof androidUiElements.$inferSelect;

export const androidElementSchema = z.object({
  type: z.string(),
  bounds: z.object({
    left: z.number(),
    top: z.number(),
    right: z.number(),
    bottom: z.number(),
  }),
  text: z.string().optional(),
  contentDescription: z.string().optional(),
  children: z.array(z.lazy(() => androidElementSchema)).optional(),
});

export type AndroidElement = z.infer<typeof androidElementSchema>;
