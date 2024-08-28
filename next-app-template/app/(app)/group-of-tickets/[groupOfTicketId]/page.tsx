import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getGroupOfTicketById } from "@/lib/api/groupOfTickets/queries";
import { getEvents } from "@/lib/api/events/queries";import OptimisticGroupOfTicket from "@/app/(app)/group-of-tickets/[groupOfTicketId]/OptimisticGroupOfTicket";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function GroupOfTicketPage({
  params,
}: {
  params: { groupOfTicketId: string };
}) {

  return (
    <main className="overflow-auto">
      <GroupOfTicket id={params.groupOfTicketId} />
    </main>
  );
}

const GroupOfTicket = async ({ id }: { id: string }) => {
  
  const { groupOfTicket } = await getGroupOfTicketById(id);
  const { events } = await getEvents();

  if (!groupOfTicket) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="group-of-tickets" />
        <OptimisticGroupOfTicket groupOfTicket={groupOfTicket} events={events} />
      </div>
    </Suspense>
  );
};
