import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { events } from "./events"
import { type getGroupOfTickets } from "@/lib/api/groupOfTickets/queries";

import { nanoid } from "@/lib/utils";


export const groupOfTickets = sqliteTable('group_of_tickets', {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  type: text("type").notNull(),
  quantity: integer("quantity").notNull(),
  eventId: text("event_id").references(() => events.id, { onDelete: "cascade" }).notNull()
});


// Schema for groupOfTickets - used to validate API requests
const baseSchema = createSelectSchema(groupOfTickets)

export const insertGroupOfTicketSchema = createInsertSchema(groupOfTickets);
export const insertGroupOfTicketParams = baseSchema.extend({
  quantity: z.coerce.number(),
  eventId: z.coerce.string().min(1)
}).omit({ 
  id: true
});

export const updateGroupOfTicketSchema = baseSchema;
export const updateGroupOfTicketParams = baseSchema.extend({
  quantity: z.coerce.number(),
  eventId: z.coerce.string().min(1)
})
export const groupOfTicketIdSchema = baseSchema.pick({ id: true });

// Types for groupOfTickets - used to type API request params and within Components
export type GroupOfTicket = typeof groupOfTickets.$inferSelect;
export type NewGroupOfTicket = z.infer<typeof insertGroupOfTicketSchema>;
export type NewGroupOfTicketParams = z.infer<typeof insertGroupOfTicketParams>;
export type UpdateGroupOfTicketParams = z.infer<typeof updateGroupOfTicketParams>;
export type GroupOfTicketId = z.infer<typeof groupOfTicketIdSchema>["id"];
    
// this type infers the return from getGroupOfTickets() - meaning it will include any joins
export type CompleteGroupOfTicket = Awaited<ReturnType<typeof getGroupOfTickets>>["groupOfTickets"][number];

