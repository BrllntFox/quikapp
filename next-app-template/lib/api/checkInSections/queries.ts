import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { type CheckInSectionId, checkInSectionIdSchema, checkInSections } from "@/lib/db/schema/checkInSections";
import { events } from "@/lib/db/schema/events";

export const getCheckInSections = async () => {
  const rows = await db.select({ checkInSection: checkInSections, event: events }).from(checkInSections).leftJoin(events, eq(checkInSections.eventId, events.id));
  const c = rows .map((r) => ({ ...r.checkInSection, event: r.event})); 
  console.log("getCheckinSecs",c)
  return { checkInSections: c };
};

export const getCheckInSectionById = async (id: CheckInSectionId) => {
  const { id: checkInSectionId } = checkInSectionIdSchema.parse({ id });
  const [row] = await db.select({ checkInSection: checkInSections, event: events }).from(checkInSections).where(eq(checkInSections.id, checkInSectionId)).leftJoin(events, eq(checkInSections.eventId, events.id));
  if (row === undefined) return {};
  const c =  { ...row.checkInSection, event: row.event } ;
  return { checkInSection: c };
};


