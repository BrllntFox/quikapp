"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/check-in-sections/useOptimisticCheckInSections";
import { type CheckInSection } from "@/lib/db/schema/checkInSections";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import CheckInSectionForm from "@/components/checkInSections/CheckInSectionForm";
import { type Event, type EventId } from "@/lib/db/schema/events";

export default function OptimisticCheckInSection({ 
  checkInSection,
  events,
  eventId 
}: { 
  checkInSection: CheckInSection; 
  
  events: Event[];
  eventId?: EventId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: CheckInSection) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticCheckInSection, setOptimisticCheckInSection] = useOptimistic(checkInSection);
  const updateCheckInSection: TAddOptimistic = (input) =>
    setOptimisticCheckInSection({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <CheckInSectionForm
          checkInSection={optimisticCheckInSection}
          events={events}
        eventId={eventId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateCheckInSection}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticCheckInSection.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticCheckInSection.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticCheckInSection, null, 2)}
      </pre>
    </div>
  );
}
