import { Suspense } from "react";

import Loading from "@/app/loading";
import GroupOfTicketList from "@/components/groupOfTickets/GroupOfTicketList";
import { getGroupOfTickets } from "@/lib/api/groupOfTickets/queries";
import { getEvents } from "@/lib/api/events/queries";

export const revalidate = 0;

export default async function GroupOfTicketsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Group Of Tickets</h1>
        </div>
        <GroupOfTickets />
      </div>
    </main>
  );
}

const GroupOfTickets = async () => {
  
  const { groupOfTickets } = await getGroupOfTickets();
  const { events } = await getEvents();
  return (
    <Suspense fallback={<Loading />}>
      <GroupOfTicketList groupOfTickets={groupOfTickets} events={events} />
    </Suspense>
  );
};
