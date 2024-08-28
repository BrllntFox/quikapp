import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { events } from "./events"
import { type getCheckInSections } from "@/lib/api/checkInSections/queries";

import { nanoid } from "@/lib/utils";


export const checkInSections = sqliteTable('check_in_sections', {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  description: text("description").notNull(),
  checkInAt: text("check_in_at").notNull(),
  eventId: text("event_id").references(() => events.id, { onDelete: "cascade" }).notNull()
});


// Schema for checkInSections - used to validate API requests
const baseSchema = createSelectSchema(checkInSections)

export const insertCheckInSectionSchema = createInsertSchema(checkInSections);
export const insertCheckInSectionParams = baseSchema.extend({
  eventId: z.coerce.string().min(1)
}).omit({ 
  id: true
});

export const updateCheckInSectionSchema = baseSchema;
export const updateCheckInSectionParams = baseSchema.extend({
  eventId: z.coerce.string().min(1)
})
export const checkInSectionIdSchema = baseSchema.pick({ id: true });

// Types for checkInSections - used to type API request params and within Components
export type CheckInSection = typeof checkInSections.$inferSelect;
export type NewCheckInSection = z.infer<typeof insertCheckInSectionSchema>;
export type NewCheckInSectionParams = z.infer<typeof insertCheckInSectionParams>;
export type UpdateCheckInSectionParams = z.infer<typeof updateCheckInSectionParams>;
export type CheckInSectionId = z.infer<typeof checkInSectionIdSchema>["id"];
    
// this type infers the return from getCheckInSections() - meaning it will include any joins
export type CompleteCheckInSection = Awaited<ReturnType<typeof getCheckInSections>>["checkInSections"][number];

