import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/events/useOptimisticEvents";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";
import { Input as NextInput, Textarea as NextTextarea } from "@nextui-org/input"
import { DatePicker } from "@nextui-org/date-picker";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type Event, insertEventParams } from "@/lib/db/schema/events";
import {
  createEventAction,
  deleteEventAction,
  updateEventAction,
} from "@/lib/actions/events";
import { type Organizer, type OrganizerId } from "@/lib/db/schema/organizers";
import { getLocalTimeZone, now, parseDate, today } from "@internationalized/date";

const EventForm = ({
  organizers,
  organizerId,
  event,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  event?: Event | null;
  organizers: Organizer[];
  organizerId?: OrganizerId
  openModal?: (event?: Event) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Event>(insertEventParams);
  const editing = !!event?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("events");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: Event },
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`Event ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);
    const payload = Object.fromEntries(data.entries());
    const eventParsed = await insertEventParams.safeParseAsync({ organizerId, ...payload });
console.log(eventParsed.error)

    if (!eventParsed.success) {
      setErrors(eventParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = eventParsed.data;
    const pendingEvent: Event = {
      status:event?.status??"unpublic",
      updatedAt: event?.updatedAt ?? new Date().toISOString().slice(0, 19).replace("T", " "),
      createdAt: event?.createdAt ?? new Date().toISOString().slice(0, 19).replace("T", " "),
      id: event?.id ?? "",
      userId: event?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingEvent,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateEventAction({ ...values, id: event.id })
          : await createEventAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingEvent
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined,
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={(data:FormData)=>handleSubmit(data)} onChange={handleChange} className={"space-y-8"}>
      {/* Schema fields start */}
      
        <NextInput
          type="text"
          name="eventName"
          label="Event's Name"
          required
          isInvalid={errors?.eventName ? true : false}
          errorMessage={`${errors?.eventName}`}
          defaultValue={event?.eventName ?? ""}
        />
      
      <div>
        <NextInput
          type="text"
          name="location"
          label="Location"
          required
          isInvalid={errors?.location ? true : false}
          errorMessage={`${errors?.location}`}
          defaultValue={event?.location ?? ""}
        />
      </div>
      <div>
        <NextTextarea
          type="text"
          name="description"
          label="Description"
          required
          isInvalid={errors?.description ? true : false}
          errorMessage={`${errors?.description}`}
          defaultValue={event?.description ?? ""}
        />

      </div>
      <div>
        <DatePicker
          name="date"
          classNames={{
            popoverContent: "pointer-events-auto",
          }}
          label="Event Date"
          isRequired
          defaultValue={event ? parseDate(event.date) : today(getLocalTimeZone())}
          minValue={today(getLocalTimeZone())}
        />
      </div>


      {organizerId ? null : <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.organizerId ? "text-destructive" : "",
          )}
        >
          Organizer
        </Label>
        <Select defaultValue={event?.organizerId} name="organizerId">
          <SelectTrigger
            className={cn(errors?.organizerId ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Select a organizer" />
          </SelectTrigger>
          <SelectContent>
            {organizers?.map((organizer) => (
              <SelectItem key={organizer.id} value={organizer.id.toString()}>
                {organizer.id}{/* TODO: Replace with a field from the organizer model */}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.organizerId ? (
          <p className="text-xs text-destructive mt-2">{errors.organizerId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>}
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic && addOptimistic({ action: "delete", data: event });
              const error = await deleteEventAction(event.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: event,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default EventForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
