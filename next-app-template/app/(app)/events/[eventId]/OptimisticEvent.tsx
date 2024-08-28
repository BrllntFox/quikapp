"use client";

import { useOptimistic, useState, useTransition } from "react";
import { TAddOptimistic } from "@/app/(app)/events/useOptimisticEvents";
import { EventId, type Event } from "@/lib/db/schema/events";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import EventForm from "@/components/events/EventForm";
import { type Organizer, type OrganizerId } from "@/lib/db/schema/organizers";
import { setPublicEvent } from "@/lib/actions/events";

export default function OptimisticEvent({
  event,
  organizers,
  organizerId,
}: {
  event: Event;
  organizers: Organizer[];
  organizerId?: OrganizerId;
}) {
  const [isPending, startTransition] = useTransition();
  
  const [open, setOpen] = useState(false);
  const openModal = (_?: Event) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticEvent, setOptimisticEvent] = useOptimistic(
    event   
  );
  const updateEvent: TAddOptimistic = (input) =>
    setOptimisticEvent({ ...input.data });

 async function updateStatus ({ event }: { event: Event })  {
    try {
      startTransition(async () => {
        const newStatus = event.status==="public"?"unpublic":"public"
        const pendingEvent= {...event,status:newStatus}
        console.log(newStatus)
        //optimistic UI
        updateEvent({
          data:pendingEvent,
          action:"update"
        })
        //action
        const err = await setPublicEvent(event.id, newStatus)
        console.log("err:   ",err)
      }
      )
    }
    catch (e) {
      throw new Error(`Error at: ${e}`)
    }

  }


  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <EventForm
          event={optimisticEvent}
          organizers={organizers}
          organizerId={organizerId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateEvent}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticEvent.eventName}</h1>
        <div className="flex gap-2">
          <Button className="" onClick={() => setOpen(true)}>
            Edit
          </Button>
          <Button disabled={isPending} variant={"secondary"} onClick={() => updateStatus({ event: event })}>
            {optimisticEvent.status === "unpublic" ? "Public" : "Unpublic"}
          </Button>
        </div>
      </div>



      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticEvent.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticEvent, null, 2)}
      </pre>
    </div>
  );
}
function startMutation(arg0: () => Promise<void>) {
  throw new Error("Function not implemented.");
}

