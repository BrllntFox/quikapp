import { type Event } from "@/lib/db/schema/events";
import { type CheckInSection, type CompleteCheckInSection } from "@/lib/db/schema/checkInSections";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<CheckInSection>) => void;

export const useOptimisticCheckInSections = (
  checkInSections: CompleteCheckInSection[],
  events: Event[]
) => {
  const [optimisticCheckInSections, addOptimisticCheckInSection] = useOptimistic(
    checkInSections,
    (
      currentState: CompleteCheckInSection[],
      action: OptimisticAction<CheckInSection>,
    ): CompleteCheckInSection[] => {
      const { data } = action;

      const optimisticEvent = events.find(
        (event) => event.id === data.eventId,
      )!;

      const optimisticCheckInSection = {
        ...data,
        event: optimisticEvent,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticCheckInSection]
            : [...currentState, optimisticCheckInSection];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticCheckInSection } : item,
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

  return { addOptimisticCheckInSection, optimisticCheckInSections };
};
