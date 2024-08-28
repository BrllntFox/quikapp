import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { 
  OrganizerId, 
  NewOrganizerParams,
  UpdateOrganizerParams, 
  updateOrganizerSchema,
  insertOrganizerSchema, 
  organizers,
  organizerIdSchema 
} from "@/lib/db/schema/organizers";
import { getUserAuth } from "@/lib/auth/utils";

export const createOrganizer = async (organizer: NewOrganizerParams) => {
  const { session } = await getUserAuth();
  const newOrganizer = insertOrganizerSchema.parse({ ...organizer, userId: session?.user.id! });
  try {
    const [o] =  await db.insert(organizers).values(newOrganizer).returning();
    return { organizer: o };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateOrganizer = async (id: OrganizerId, organizer: UpdateOrganizerParams) => {
  const { session } = await getUserAuth();
  const { id: organizerId } = organizerIdSchema.parse({ id });
  const newOrganizer = updateOrganizerSchema.parse({ ...organizer, userId: session?.user.id! });
  try {
    const [o] =  await db
     .update(organizers)
     .set(newOrganizer)
     .where(and(eq(organizers.id, organizerId!), eq(organizers.userId, session?.user.id!)))
     .returning();
    return { organizer: o };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteOrganizer = async (id: OrganizerId) => {
  const { session } = await getUserAuth();
  const { id: organizerId } = organizerIdSchema.parse({ id });
  try {
    const [o] =  await db.delete(organizers).where(and(eq(organizers.id, organizerId!), eq(organizers.userId, session?.user.id!)))
    .returning();
    return { organizer: o };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

