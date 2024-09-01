import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { checkAuth, getUserAuth } from "@/lib/auth/utils";
import { type EventId, eventIdSchema, events } from "@/lib/db/schema/events";
import { organizers } from "@/lib/db/schema/organizers";
import { groupOfTickets, type CompleteGroupOfTicket } from "@/lib/db/schema/groupOfTickets";
import { checkInSections, type CompleteCheckInSection } from "@/lib/db/schema/checkInSections";

export const getEvents = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select({ event: events, organizer: organizers }).from(events).leftJoin(organizers, eq(events.organizerId, organizers.id)).where(eq(events.userId, session?.user.id!));
  const e = rows .map((r) => ({ ...r.event, organizer: r.organizer})); 
  return { events: e };
};

export const getPublicEvents = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select({ event: events, organizer: organizers }).from(events).leftJoin(organizers, eq(events.organizerId, organizers.id)).where(eq(events.status,"public"));
  const e = rows .map((r) => ({ ...r.event, organizer: r.organizer})); 
  return { publicEvents: e };
};

export const getEventById = async (id: EventId) => {
  const { session } = await getUserAuth();
  const { id: eventId } = eventIdSchema.parse({ id });
  const [row] = await db.select({ event: events, organizer: organizers }).from(events).where(and(eq(events.id, eventId), eq(events.userId, session?.user.id!))).leftJoin(organizers, eq(events.organizerId, organizers.id));
  if (row === undefined) return {};
  const e =  { ...row.event, organizer: row.organizer } ;
  return { event: e };
};

export const getEventByIdWithGroupOfTicketsAndCheckInSections = async (id: EventId) => {
  // const { session } = await getUserAuth();
  await checkAuth()
  const { id: eventId } = eventIdSchema.parse({ id });
  const rows = await db.select({ event: events, groupOfTicket: groupOfTickets }).from(events).where(eq(events.id, eventId)).leftJoin(groupOfTickets, eq(events.id, groupOfTickets.eventId))
  const crows = await db.select({ event: events, checkInSection: checkInSections }).from(events).where(eq(events.id, eventId)).leftJoin(checkInSections, eq(events.id, checkInSections.eventId));
  if (rows.length === 0) return {};
  const e = rows[0].event;
  const eg = rows.filter((r) => r.groupOfTicket !== null).map((g) => g.groupOfTicket) as CompleteGroupOfTicket[];
  const ec = crows.filter((r) => r.checkInSection !== null).map((c) => c.checkInSection) as CompleteCheckInSection[];
  return { event: e, groupOfTickets: eg, checkInSections: ec };
};

