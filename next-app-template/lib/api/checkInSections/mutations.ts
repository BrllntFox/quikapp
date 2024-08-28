import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { 
  CheckInSectionId, 
  NewCheckInSectionParams,
  UpdateCheckInSectionParams, 
  updateCheckInSectionSchema,
  insertCheckInSectionSchema, 
  checkInSections,
  checkInSectionIdSchema 
} from "@/lib/db/schema/checkInSections";

export const createCheckInSection = async (checkInSection: NewCheckInSectionParams) => {
  const newCheckInSection = insertCheckInSectionSchema.parse(checkInSection);
  try {
    const [c] =  await db.insert(checkInSections).values(newCheckInSection).returning();
    return { checkInSection: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateCheckInSection = async (id: CheckInSectionId, checkInSection: UpdateCheckInSectionParams) => {
  const { id: checkInSectionId } = checkInSectionIdSchema.parse({ id });
  const newCheckInSection = updateCheckInSectionSchema.parse(checkInSection);
  try {
    const [c] =  await db
     .update(checkInSections)
     .set(newCheckInSection)
     .where(eq(checkInSections.id, checkInSectionId!))
     .returning();
    return { checkInSection: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteCheckInSection = async (id: CheckInSectionId) => {
  const { id: checkInSectionId } = checkInSectionIdSchema.parse({ id });
  try {
    const [c] =  await db.delete(checkInSections).where(eq(checkInSections.id, checkInSectionId!))
    .returning();
    return { checkInSection: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

