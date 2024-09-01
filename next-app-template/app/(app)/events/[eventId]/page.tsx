import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getEventByIdWithGroupOfTicketsAndCheckInSections, getPublicEvents } from "@/lib/api/events/queries";
import { getOrganizers, getPublicOrganizers } from "@/lib/api/organizers/queries";import OptimisticEvent from "@/app/(app)/events/[eventId]/OptimisticEvent";
import { checkAuth, getUserAuth } from "@/lib/auth/utils";
import GroupOfTicketList from "@/components/groupOfTickets/GroupOfTicketList";
import CheckInSectionList from "@/components/checkInSections/CheckInSectionList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";
import { publicEvent } from "@/lib/api/events/mutations";


export const revalidate = 0;

export default async function EventPage({
  params,
}: {
  params: { eventId: string };
}) {

  return (
    <main className="overflow-auto">
      <Event id={params.eventId} />
    </main>
  );
}

const Event = async ({ id }: { id: string }) => {
  const {session} = await getUserAuth()  
  const { event, groupOfTickets, checkInSections } = await getEventByIdWithGroupOfTicketsAndCheckInSections(id);
  const { organizers } = await getOrganizers();
  const {publicOrganizers} =await getPublicOrganizers()
  if (!event) notFound();
  const forPublic = event.status === "public"
  const isOwner = session?.user.id === event.userId
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="events" />
        <OptimisticEvent event={event} organizers={forPublic?publicOrganizers:organizers} forPublic={forPublic} isOwner={isOwner}/>
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{event.eventName}&apos;s Group Of Tickets</h3>
        <GroupOfTicketList
          events={[]}
          eventId={event.id}
          groupOfTickets={groupOfTickets}
        />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{event.eventName}&apos;s Check In Sections</h3>
        <CheckInSectionList
          events={[]}
          eventId={event.id}
          checkInSections={checkInSections}
        />
      </div>
    </Suspense>
  );
};
