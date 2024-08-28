import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { 
  GroupOfTicketId, 
  NewGroupOfTicketParams,
  UpdateGroupOfTicketParams, 
  updateGroupOfTicketSchema,
  insertGroupOfTicketSchema, 
  groupOfTickets,
  groupOfTicketIdSchema 
} from "@/lib/db/schema/groupOfTickets";

export const createGroupOfTicket = async (groupOfTicket: NewGroupOfTicketParams) => {
  const newGroupOfTicket = insertGroupOfTicketSchema.parse(groupOfTicket);
  try {
    const [g] =  await db.insert(groupOfTickets).values(newGroupOfTicket).returning();
    return { groupOfTicket: g };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateGroupOfTicket = async (id: GroupOfTicketId, groupOfTicket: UpdateGroupOfTicketParams) => {
  const { id: groupOfTicketId } = groupOfTicketIdSchema.parse({ id });
  const newGroupOfTicket = updateGroupOfTicketSchema.parse(groupOfTicket);
  try {
    const [g] =  await db
     .update(groupOfTickets)
     .set(newGroupOfTicket)
     .where(eq(groupOfTickets.id, groupOfTicketId!))
     .returning();
    return { groupOfTicket: g };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteGroupOfTicket = async (id: GroupOfTicketId) => {
  const { id: groupOfTicketId } = groupOfTicketIdSchema.parse({ id });
  try {
    const [g] =  await db.delete(groupOfTickets).where(eq(groupOfTickets.id, groupOfTicketId!))
    .returning();
    return { groupOfTicket: g };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

