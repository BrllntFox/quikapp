"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Organizer, CompleteOrganizer } from "@/lib/db/schema/organizers";
import Modal from "@/components/shared/Modal";

import { useOptimisticOrganizers } from "@/app/(app)/organizers/useOptimisticOrganizers";
import { Button } from "@/components/ui/button";
import OrganizerForm from "./OrganizerForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (organizer?: Organizer) => void;

export default function OrganizerList({
  organizers,
   
}: {
  organizers: CompleteOrganizer[];
   
}) {
  const { optimisticOrganizers, addOptimisticOrganizer } = useOptimisticOrganizers(
    organizers,
     
  );
  const [open, setOpen] = useState(false);
  const [activeOrganizer, setActiveOrganizer] = useState<Organizer | null>(null);
  const openModal = (organizer?: Organizer) => {
    setOpen(true);
    organizer ? setActiveOrganizer(organizer) : setActiveOrganizer(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeOrganizer ? "Edit Organizer" : "Create Organizer"}
      >
        <OrganizerForm
          organizer={activeOrganizer}
          addOptimistic={addOptimisticOrganizer}
          openModal={openModal}
          closeModal={closeModal}
          
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticOrganizers.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticOrganizers.map((organizer) => (
            <Organizer
              organizer={organizer}
              key={organizer.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Organizer = ({
  organizer,
  openModal,
}: {
  organizer: CompleteOrganizer;
  openModal: TOpenModal;
}) => {
  const optimistic = organizer.id === "optimistic";
  const deleting = organizer.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("organizers")
    ? pathname
    : pathname + "/organizers/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{organizer.organizerName}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + organizer.id }>
          Edit
        </Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No organizers
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new organizer.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Organizers </Button>
      </div>
    </div>
  );
};
