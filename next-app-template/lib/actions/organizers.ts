"use server";

import { revalidatePath } from "next/cache";
import {
  createOrganizer,
  deleteOrganizer,
  updateOrganizer,
} from "@/lib/api/organizers/mutations";
import {
  OrganizerId,
  NewOrganizerParams,
  UpdateOrganizerParams,
  organizerIdSchema,
  insertOrganizerParams,
  updateOrganizerParams,
} from "@/lib/db/schema/organizers";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateOrganizers = () => revalidatePath("/organizers");

export const createOrganizerAction = async (input: NewOrganizerParams) => {
  try {
    const payload = insertOrganizerParams.parse(input);
    await createOrganizer(payload);
    revalidateOrganizers();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateOrganizerAction = async (input: UpdateOrganizerParams) => {
  try {
    const payload = updateOrganizerParams.parse(input);
    await updateOrganizer(payload.id, payload);
    revalidateOrganizers();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteOrganizerAction = async (input: OrganizerId) => {
  try {
    const payload = organizerIdSchema.parse({ id: input });
    await deleteOrganizer(payload.id);
    revalidateOrganizers();
  } catch (e) {
    return handleErrors(e);
  }
};