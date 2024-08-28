"use server";

import { revalidatePath } from "next/cache";
import {
  createCheckInSection,
  deleteCheckInSection,
  updateCheckInSection,
} from "@/lib/api/checkInSections/mutations";
import {
  CheckInSectionId,
  NewCheckInSectionParams,
  UpdateCheckInSectionParams,
  checkInSectionIdSchema,
  insertCheckInSectionParams,
  updateCheckInSectionParams,
} from "@/lib/db/schema/checkInSections";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateCheckInSections = () => revalidatePath("/check-in-sections");

export const createCheckInSectionAction = async (input: NewCheckInSectionParams) => {
  try {
    const payload = insertCheckInSectionParams.parse(input);
    await createCheckInSection(payload);
    revalidateCheckInSections();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateCheckInSectionAction = async (input: UpdateCheckInSectionParams) => {
  try {
    const payload = updateCheckInSectionParams.parse(input);
    await updateCheckInSection(payload.id, payload);
    revalidateCheckInSections();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteCheckInSectionAction = async (input: CheckInSectionId) => {
  try {
    const payload = checkInSectionIdSchema.parse({ id: input });
    await deleteCheckInSection(payload.id);
    revalidateCheckInSections();
  } catch (e) {
    return handleErrors(e);
  }
};