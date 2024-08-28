"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/organizers/useOptimisticOrganizers";
import { type Organizer } from "@/lib/db/schema/organizers";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import OrganizerForm from "@/components/organizers/OrganizerForm";


export default function OptimisticOrganizer({ 
  organizer,
   
}: { 
  organizer: Organizer; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Organizer) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticOrganizer, setOptimisticOrganizer] = useOptimistic(organizer);
  const updateOrganizer: TAddOptimistic = (input) =>
    setOptimisticOrganizer({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <OrganizerForm
          organizer={optimisticOrganizer}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateOrganizer}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticOrganizer.organizerName}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticOrganizer.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticOrganizer, null, 2)}
      </pre>
    </div>
  );
}
