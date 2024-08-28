"use server";

import { revalidatePath } from "next/cache";
import {
  createTicket,
  deleteTicket,
  updateTicket,
} from "@/lib/api/tickets/mutations";
import {
  TicketId,
  NewTicketParams,
  UpdateTicketParams,
  ticketIdSchema,
  insertTicketParams,
  updateTicketParams,
} from "@/lib/db/schema/tickets";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateTickets = () => revalidatePath("/tickets");

export const createTicketAction = async (input: NewTicketParams) => {
  try {
    const payload = insertTicketParams.parse(input);
    await createTicket(payload);
    revalidateTickets();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateTicketAction = async (input: UpdateTicketParams) => {
  try {
    const payload = updateTicketParams.parse(input);
    await updateTicket(payload.id, payload);
    revalidateTickets();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteTicketAction = async (input: TicketId) => {
  try {
    const payload = ticketIdSchema.parse({ id: input });
    await deleteTicket(payload.id);
    revalidateTickets();
  } catch (e) {
    return handleErrors(e);
  }
};