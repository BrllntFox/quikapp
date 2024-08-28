import { sql } from "drizzle-orm";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { organizers } from "./organizers"
import { type getEvents } from "@/lib/api/events/queries";

import { nanoid, timestamps } from "@/lib/utils";


export const events = sqliteTable('events', {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  eventName: text("event_name").notNull(),
  date: text("date").notNull(),
  location: text("location"),
  description: text("description").notNull(),
  status: text("status").default("unpublic"),
  organizerId: text("organizer_id").references(() => organizers.id, { onDelete: "cascade" }).notNull(),
  userId: text("user_id").notNull(),
  
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

});


// Schema for events - used to validate API requests
const baseSchema = createSelectSchema(events).omit({...timestamps,status:true})

export const insertEventSchema = createInsertSchema(events).omit(timestamps);
export const insertEventParams = baseSchema.extend({
  organizerId: z.coerce.string().min(1)
}).omit({ 
  id: true,
  userId: true,
});

export const updateEventSchema = baseSchema;
export const updateEventParams = baseSchema.extend({
  organizerId: z.coerce.string().min(1)
}).omit({ 
  userId: true
});
export const eventIdSchema = baseSchema.pick({ id: true });

// Types for events - used to type API request params and within Components
export type Event = typeof events.$inferSelect;
export type NewEvent = z.infer<typeof insertEventSchema>;
export type NewEventParams = z.infer<typeof insertEventParams>;
export type UpdateEventParams = z.infer<typeof updateEventParams>;
export type EventId = z.infer<typeof eventIdSchema>["id"];
    
// this type infers the return from getEvents() - meaning it will include any joins
export type CompleteEvent = Awaited<ReturnType<typeof getEvents>>["events"][number];

