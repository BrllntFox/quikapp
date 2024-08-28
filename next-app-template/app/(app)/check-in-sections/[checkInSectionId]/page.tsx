import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getCheckInSectionById } from "@/lib/api/checkInSections/queries";
import { getEvents } from "@/lib/api/events/queries";import OptimisticCheckInSection from "@/app/(app)/check-in-sections/[checkInSectionId]/OptimisticCheckInSection";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function CheckInSectionPage({
  params,
}: {
  params: { checkInSectionId: string };
}) {

  return (
    <main className="overflow-auto">
      <CheckInSection id={params.checkInSectionId} />
    </main>
  );
}

const CheckInSection = async ({ id }: { id: string }) => {
  
  const { checkInSection } = await getCheckInSectionById(id);
  const { events } = await getEvents();

  if (!checkInSection) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="check-in-sections" />
        <OptimisticCheckInSection checkInSection={checkInSection} events={events} />
      </div>
    </Suspense>
  );
};
