import { type Event } from "@/lib/db/schema/events";
import { type GroupOfTicket, type CompleteGroupOfTicket } from "@/lib/db/schema/groupOfTickets";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<GroupOfTicket>) => void;

export const useOptimisticGroupOfTickets = (
  groupOfTickets: CompleteGroupOfTicket[],
  events: Event[]
) => {
  const [optimisticGroupOfTickets, addOptimisticGroupOfTicket] = useOptimistic(
    groupOfTickets,
    (
      currentState: CompleteGroupOfTicket[],
      action: OptimisticAction<GroupOfTicket>,
    ): CompleteGroupOfTicket[] => {
      const { data } = action;

      const optimisticEvent = events.find(
        (event) => event.id === data.eventId,
      )!;

      const optimisticGroupOfTicket = {
        ...data,
        event: optimisticEvent,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticGroupOfTicket]
            : [...currentState, optimisticGroupOfTicket];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticGroupOfTicket } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticGroupOfTicket, optimisticGroupOfTickets };
};
