"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/group-of-tickets/useOptimisticGroupOfTickets";
import { type GroupOfTicket } from "@/lib/db/schema/groupOfTickets";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import GroupOfTicketForm from "@/components/groupOfTickets/GroupOfTicketForm";
import { type Event, type EventId } from "@/lib/db/schema/events";

export default function OptimisticGroupOfTicket({ 
  groupOfTicket,
  events,
  eventId 
}: { 
  groupOfTicket: GroupOfTicket; 
  
  events: Event[];
  eventId?: EventId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: GroupOfTicket) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticGroupOfTicket, setOptimisticGroupOfTicket] = useOptimistic(groupOfTicket);
  const updateGroupOfTicket: TAddOptimistic = (input) =>
    setOptimisticGroupOfTicket({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <GroupOfTicketForm
          groupOfTicket={optimisticGroupOfTicket}
          events={events}
        eventId={eventId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateGroupOfTicket}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticGroupOfTicket.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticGroupOfTicket.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticGroupOfTicket, null, 2)}
      </pre>
    </div>
  );
}
