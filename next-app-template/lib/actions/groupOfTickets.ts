"use server";

import { revalidatePath } from "next/cache";
import {
  createGroupOfTicket,
  deleteGroupOfTicket,
  updateGroupOfTicket,
} from "@/lib/api/groupOfTickets/mutations";
import {
  GroupOfTicketId,
  NewGroupOfTicketParams,
  UpdateGroupOfTicketParams,
  groupOfTicketIdSchema,
  insertGroupOfTicketParams,
  updateGroupOfTicketParams,
} from "@/lib/db/schema/groupOfTickets";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateGroupOfTickets = () => revalidatePath("/group-of-tickets");

export const createGroupOfTicketAction = async (input: NewGroupOfTicketParams) => {
  try {
    const payload = insertGroupOfTicketParams.parse(input);
    await createGroupOfTicket(payload);
    revalidateGroupOfTickets();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateGroupOfTicketAction = async (input: UpdateGroupOfTicketParams) => {
  try {
    const payload = updateGroupOfTicketParams.parse(input);
    await updateGroupOfTicket(payload.id, payload);
    revalidateGroupOfTickets();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteGroupOfTicketAction = async (input: GroupOfTicketId) => {
  try {
    const payload = groupOfTicketIdSchema.parse({ id: input });
    await deleteGroupOfTicket(payload.id);
    revalidateGroupOfTickets();
  } catch (e) {
    return handleErrors(e);
  }
};