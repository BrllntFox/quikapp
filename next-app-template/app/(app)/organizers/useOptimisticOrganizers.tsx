
import { type Organizer, type CompleteOrganizer } from "@/lib/db/schema/organizers";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Organizer>) => void;

export const useOptimisticOrganizers = (
  organizers: CompleteOrganizer[],
  
) => {
  const [optimisticOrganizers, addOptimisticOrganizer] = useOptimistic(
    organizers,
    (
      currentState: CompleteOrganizer[],
      action: OptimisticAction<Organizer>,
    ): CompleteOrganizer[] => {
      const { data } = action;

      

      const optimisticOrganizer = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticOrganizer]
            : [...currentState, optimisticOrganizer];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticOrganizer } : item,
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

  return { addOptimisticOrganizer, optimisticOrganizers };
};
