import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type OrganizerId, organizerIdSchema, organizers } from "@/lib/db/schema/organizers";
import { events, type CompleteEvent } from "@/lib/db/schema/events";

export const getOrganizers = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select().from(organizers).where(eq(organizers.userId, session?.user.id!));
  const o = rows
  return { organizers: o };
};

export const getPublicOrganizers = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select().from(organizers);
  const o = rows
  return { publicOrganizers: o };
};

export const getOrganizerById = async (id: OrganizerId) => {
  const { session } = await getUserAuth();
  const { id: organizerId } = organizerIdSchema.parse({ id });
  const [row] = await db.select().from(organizers).where(and(eq(organizers.id, organizerId), eq(organizers.userId, session?.user.id!)));
  if (row === undefined) return {};
  const o = row;
  return { organizer: o };
};

export const getOrganizerByIdWithEvents = async (id: OrganizerId) => {
  const { session } = await getUserAuth();
  const { id: organizerId } = organizerIdSchema.parse({ id });
  const rows = await db.select({ organizer: organizers, event: events }).from(organizers).where(and(eq(organizers.id, organizerId), eq(organizers.userId, session?.user.id!))).leftJoin(events, eq(organizers.id, events.organizerId));
  if (rows.length === 0) return {};
  const o = rows[0].organizer;
  const oe = rows.filter((r) => r.event !== null).map((e) => e.event) as CompleteEvent[];

  return { organizer: o, events: oe };
};

