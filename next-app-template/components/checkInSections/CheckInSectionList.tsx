"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type CheckInSection, CompleteCheckInSection } from "@/lib/db/schema/checkInSections";
import Modal from "@/components/shared/Modal";
import { type Event, type EventId } from "@/lib/db/schema/events";
import { useOptimisticCheckInSections } from "@/app/(app)/check-in-sections/useOptimisticCheckInSections";
import { Button } from "@/components/ui/button";
import CheckInSectionForm from "./CheckInSectionForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (checkInSection?: CheckInSection) => void;

export default function CheckInSectionList({
  checkInSections,
  events,
  eventId 
}: {
  checkInSections: CompleteCheckInSection[];
  events: Event[];
  eventId?: EventId 
}) {
  const { optimisticCheckInSections, addOptimisticCheckInSection } = useOptimisticCheckInSections(
    checkInSections,
    events 
  );
  const [open, setOpen] = useState(false);
  const [activeCheckInSection, setActiveCheckInSection] = useState<CheckInSection | null>(null);
  const openModal = (checkInSection?: CheckInSection) => {
    setOpen(true);
    checkInSection ? setActiveCheckInSection(checkInSection) : setActiveCheckInSection(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeCheckInSection ? "Edit CheckInSection" : "Create Check In Section"}
      >
        <CheckInSectionForm
          checkInSection={activeCheckInSection}
          addOptimistic={addOptimisticCheckInSection}
          openModal={openModal}
          closeModal={closeModal}
          events={events}
        eventId={eventId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticCheckInSections.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticCheckInSections.map((checkInSection) => (
            <CheckInSection
              checkInSection={checkInSection}
              key={checkInSection.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const CheckInSection = ({
  checkInSection,
  openModal,
}: {
  checkInSection: CompleteCheckInSection;
  openModal: TOpenModal;
}) => {
  const optimistic = checkInSection.id === "optimistic";
  const deleting = checkInSection.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("check-in-sections")
    ? pathname
    : pathname + "/check-in-sections/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{checkInSection.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + checkInSection.id }>
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
        No check in sections
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new check in section.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Check In Sections </Button>
      </div>
    </div>
  );
};
