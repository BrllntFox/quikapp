import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { 
  TicketId, 
  NewTicketParams,
  UpdateTicketParams, 
  updateTicketSchema,
  insertTicketSchema, 
  tickets,
  ticketIdSchema 
} from "@/lib/db/schema/tickets";
import { getUserAuth } from "@/lib/auth/utils";

export const createTicket = async (ticket: NewTicketParams) => {
  const { session } = await getUserAuth();
  const newTicket = insertTicketSchema.parse({ ...ticket, userId: session?.user.id! });
  try {
    const [t] =  await db.insert(tickets).values(newTicket).returning();
    return { ticket: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateTicket = async (id: TicketId, ticket: UpdateTicketParams) => {
  const { session } = await getUserAuth();
  const { id: ticketId } = ticketIdSchema.parse({ id });
  const newTicket = updateTicketSchema.parse({ ...ticket, userId: session?.user.id! });
  try {
    const [t] =  await db
     .update(tickets)
     .set({...newTicket, updatedAt: new Date().toISOString().slice(0, 19).replace("T", " ") })
     .where(and(eq(tickets.id, ticketId!), eq(tickets.userId, session?.user.id!)))
     .returning();
    return { ticket: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteTicket = async (id: TicketId) => {
  const { session } = await getUserAuth();
  const { id: ticketId } = ticketIdSchema.parse({ id });
  try {
    const [t] =  await db.delete(tickets).where(and(eq(tickets.id, ticketId!), eq(tickets.userId, session?.user.id!)))
    .returning();
    return { ticket: t };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

