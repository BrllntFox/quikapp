import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { type GroupOfTicketId, groupOfTicketIdSchema, groupOfTickets } from "@/lib/db/schema/groupOfTickets";
import { events } from "@/lib/db/schema/events";

export const getGroupOfTickets = async () => {
  const rows = await db.select({ groupOfTicket: groupOfTickets, event: events }).from(groupOfTickets).leftJoin(events, eq(groupOfTickets.eventId, events.id));
  const g = rows .map((r) => ({ ...r.groupOfTicket, event: r.event})); 
  return { groupOfTickets: g };
};

export const getGroupOfTicketById = async (id: GroupOfTicketId) => {
  const { id: groupOfTicketId } = groupOfTicketIdSchema.parse({ id });
  const [row] = await db.select({ groupOfTicket: groupOfTickets, event: events }).from(groupOfTickets).where(eq(groupOfTickets.id, groupOfTicketId)).leftJoin(events, eq(groupOfTickets.eventId, events.id));
  if (row === undefined) return {};
  const g =  { ...row.groupOfTicket, event: row.event } ;
  return { groupOfTicket: g };
};


