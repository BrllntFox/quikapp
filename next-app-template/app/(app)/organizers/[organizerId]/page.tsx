import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getOrganizerByIdWithEvents } from "@/lib/api/organizers/queries";
import OptimisticOrganizer from "./OptimisticOrganizer";
import { checkAuth } from "@/lib/auth/utils";
import EventList from "@/components/events/EventList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function OrganizerPage({
  params,
}: {
  params: { organizerId: string };
}) {

  return (
    <main className="overflow-auto">
      <Organizer id={params.organizerId} />
    </main>
  );
}

const Organizer = async ({ id }: { id: string }) => {
  await checkAuth();

  const { organizer, events } = await getOrganizerByIdWithEvents(id);
  

  if (!organizer) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="organizers" />
        <OptimisticOrganizer organizer={organizer}  />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{organizer.organizerName}&apos;s Events</h3>
        <EventList
          organizers={[]}
          organizerId={organizer.id}
          events={events}
        />
      </div>
    </Suspense>
  );
};
