import { Suspense } from "react";

import Loading from "@/app/loading";
import EventList from "@/components/events/EventList";
import { getEvents, getPublicEvents } from "@/lib/api/events/queries";
import { getOrganizers, getPublicOrganizers } from "@/lib/api/organizers/queries";
import { checkAuth } from "@/lib/auth/utils";
import { Divider } from "@nextui-org/divider";

export const revalidate = 0;

export default async function EventsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Events</h1>
        </div>
        <Events />
      </div>
    </main>
  );
}

const Events = async ({ forPublic }: { forPublic?: boolean }) => {
  await checkAuth();
  const { publicEvents } = await getPublicEvents()
  const {publicOrganizers} = await getPublicOrganizers()
  console.log(publicOrganizers)
  const { events } = await getEvents()
  const { organizers } = await getOrganizers();
  return (
    <Suspense fallback={<Loading />}>
      <div className="flex-1 flex-rows gap-10">
        <Divider className="my-6"/>
        <h1 className="font-semibold text-2xl my-2">Organizer's Events</h1>
        <EventList events={events} organizers={organizers} />
        <Divider className="my-6"/>
        <h1 className="font-semibold text-2xl my-2">Public Events</h1>
        <EventList events={publicEvents} organizers={publicOrganizers} />
      </div>
    </Suspense>
  );
};
