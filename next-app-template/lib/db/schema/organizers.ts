import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { type getOrganizers } from "@/lib/api/organizers/queries";

import { nanoid } from "@/lib/utils";


export const organizers = sqliteTable('organizers', {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  organizerName: text("organizer_name").notNull(),
  trustedContact: text("trusted_contact").notNull(),
  status: text("status").default("unvalidated"),
  userId: text("user_id").notNull()
});


// Schema for organizers - used to validate API requests
const baseSchema = createSelectSchema(organizers).omit({status:true})

export const insertOrganizerSchema = createInsertSchema(organizers);
export const insertOrganizerParams = baseSchema.extend({}).omit({ 
  id: true,
  userId: true
});

export const updateOrganizerSchema = baseSchema;
export const updateOrganizerParams = baseSchema.extend({}).omit({ 
  userId: true
});
export const organizerIdSchema = baseSchema.pick({ id: true });

// Types for organizers - used to type API request params and within Components
export type Organizer = typeof organizers.$inferSelect;
export type NewOrganizer = z.infer<typeof insertOrganizerSchema>;
export type NewOrganizerParams = z.infer<typeof insertOrganizerParams>;
export type UpdateOrganizerParams = z.infer<typeof updateOrganizerParams>;
export type OrganizerId = z.infer<typeof organizerIdSchema>["id"];
    
// this type infers the return from getOrganizers() - meaning it will include any joins
export type CompleteOrganizer = Awaited<ReturnType<typeof getOrganizers>>["organizers"][number];

