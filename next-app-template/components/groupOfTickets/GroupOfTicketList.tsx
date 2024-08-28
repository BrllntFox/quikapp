"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type GroupOfTicket, CompleteGroupOfTicket } from "@/lib/db/schema/groupOfTickets";
import Modal from "@/components/shared/Modal";
import { type Event, type EventId } from "@/lib/db/schema/events";
import { useOptimisticGroupOfTickets } from "@/app/(app)/group-of-tickets/useOptimisticGroupOfTickets";
import { Button } from "@/components/ui/button";
import GroupOfTicketForm from "./GroupOfTicketForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (groupOfTicket?: GroupOfTicket) => void;

export default function GroupOfTicketList({
  groupOfTickets,
  events,
  eventId 
}: {
  groupOfTickets: CompleteGroupOfTicket[];
  events: Event[];
  eventId?: EventId 
}) {
  const { optimisticGroupOfTickets, addOptimisticGroupOfTicket } = useOptimisticGroupOfTickets(
    groupOfTickets,
    events 
  );
  const [open, setOpen] = useState(false);
  const [activeGroupOfTicket, setActiveGroupOfTicket] = useState<GroupOfTicket | null>(null);
  const openModal = (groupOfTicket?: GroupOfTicket) => {
    setOpen(true);
    groupOfTicket ? setActiveGroupOfTicket(groupOfTicket) : setActiveGroupOfTicket(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeGroupOfTicket ? "Edit GroupOfTicket" : "Create Group Of Ticket"}
      >
        <GroupOfTicketForm
          groupOfTicket={activeGroupOfTicket}
          addOptimistic={addOptimisticGroupOfTicket}
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
      {optimisticGroupOfTickets.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticGroupOfTickets.map((groupOfTicket) => (
            <GroupOfTicket
              groupOfTicket={groupOfTicket}
              key={groupOfTicket.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const GroupOfTicket = ({
  groupOfTicket,
  openModal,
}: {
  groupOfTicket: CompleteGroupOfTicket;
  openModal: TOpenModal;
}) => {
  const optimistic = groupOfTicket.id === "optimistic";
  const deleting = groupOfTicket.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("group-of-tickets")
    ? pathname
    : pathname + "/group-of-tickets/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{groupOfTicket.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + groupOfTicket.id }>
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
        No group of tickets
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new group of ticket.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Group Of Tickets </Button>
      </div>
    </div>
  );
};
