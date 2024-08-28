import { Suspense } from "react";

import Loading from "@/app/loading";
import OrganizerList from "@/components/organizers/OrganizerList";
import { getOrganizers } from "@/lib/api/organizers/queries";

import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function OrganizersPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Organizers</h1>
        </div>
        <Organizers />
      </div>
    </main>
  );
}

const Organizers = async () => {
  await checkAuth();

  const { organizers } = await getOrganizers();
  
  return (
    <Suspense fallback={<Loading />}>
      <OrganizerList organizers={organizers}  />
    </Suspense>
  );
};
