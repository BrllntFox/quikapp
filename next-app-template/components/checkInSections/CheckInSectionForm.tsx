import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/check-in-sections/useOptimisticCheckInSections";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type CheckInSection, insertCheckInSectionParams } from "@/lib/db/schema/checkInSections";
import {
  createCheckInSectionAction,
  deleteCheckInSectionAction,
  updateCheckInSectionAction,
} from "@/lib/actions/checkInSections";
import { type Event, type EventId } from "@/lib/db/schema/events";

import { Input as NextInput } from "@nextui-org/input"
import { TimeInput } from "@nextui-org/date-input"
import { getLocalTimeZone, now, parseTime,  toTime } from "@internationalized/date";


const CheckInSectionForm = ({
  events,
  eventId,
  checkInSection,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  checkInSection?: CheckInSection | null;
  events: Event[];
  eventId?: EventId
  openModal?: (checkInSection?: CheckInSection) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<CheckInSection>(insertCheckInSectionParams);
  const editing = !!checkInSection?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("check-in-sections");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: CheckInSection },
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
      toast.success(`CheckInSection ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const checkInSectionParsed = await insertCheckInSectionParams.safeParseAsync({ eventId, ...payload });
    if (!checkInSectionParsed.success) {
      setErrors(checkInSectionParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = checkInSectionParsed.data;
    const pendingCheckInSection: CheckInSection = {

      id: checkInSection?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingCheckInSection,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateCheckInSectionAction({ ...values, id: checkInSection.id })
          : await createCheckInSectionAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingCheckInSection
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
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      {/* Schema fields start */}
      <div>
        <NextInput
          type="text"
          name="name"
          label="Check In Name"
          required
          isInvalid={errors?.name ? true : false}
          errorMessage={`${errors?.name}`}
          defaultValue={checkInSection?.name ?? ""}
        />
      </div>
      <div>
        <NextInput
          type="text"
          name="description"
          label="Description"
          required
          isInvalid={errors?.description ? true : false}
          errorMessage={`${errors?.description}`}
          defaultValue={checkInSection?.description ?? ""}
        />
      </div>
      <div>
        <TimeInput 
          name="checkInAt"
          label="Check In Time"
          defaultValue={checkInSection ? parseTime(checkInSection?.checkInAt): toTime(now(getLocalTimeZone()))}
          isInvalid={errors?.checkInAt ? true : false}
          errorMessage={`${errors?.checkInAt}`}
        />
        
      </div>

      {eventId ? null : <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.eventId ? "text-destructive" : "",
          )}
        >
          Event
        </Label>
        <Select defaultValue={checkInSection?.eventId} name="eventId">
          <SelectTrigger
            className={cn(errors?.eventId ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Select a event" />
          </SelectTrigger>
          <SelectContent>
            {events?.map((event) => (
              <SelectItem key={event.id} value={event.id.toString()}>
                {event.id}{/* TODO: Replace with a field from the event model */}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.eventId ? (
          <p className="text-xs text-destructive mt-2">{errors.eventId[0]}</p>
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
              addOptimistic && addOptimistic({ action: "delete", data: checkInSection });
              const error = await deleteCheckInSectionAction(checkInSection.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: checkInSection,
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

export default CheckInSectionForm;

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
