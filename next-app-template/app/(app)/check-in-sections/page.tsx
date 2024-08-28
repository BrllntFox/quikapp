import { Suspense } from "react";

import Loading from "@/app/loading";
import CheckInSectionList from "@/components/checkInSections/CheckInSectionList";
import { getCheckInSections } from "@/lib/api/checkInSections/queries";
import { getEvents } from "@/lib/api/events/queries";

export const revalidate = 0;

export default async function CheckInSectionsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Check In Sections</h1>
        </div>
        <CheckInSections />
      </div>
    </main>
  );
}

const CheckInSections = async () => {
  
  const { checkInSections } = await getCheckInSections();
  const { events } = await getEvents();
  return (
    <Suspense fallback={<Loading />}>
      <CheckInSectionList checkInSections={checkInSections} events={events} />
    </Suspense>
  );
};
