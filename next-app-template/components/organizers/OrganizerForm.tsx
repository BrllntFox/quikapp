import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/organizers/useOptimisticOrganizers";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";
import { Input as NextInput } from "@nextui-org/input"



import { NewOrganizer, type Organizer, insertOrganizerParams } from "@/lib/db/schema/organizers";
import {
  createOrganizerAction,
  deleteOrganizerAction,
  updateOrganizerAction,
} from "@/lib/actions/organizers";


const OrganizerForm = ({

  organizer,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  organizer?: Organizer | null;

  openModal?: (organizer?: Organizer) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<NewOrganizer>(insertOrganizerParams);
  const editing = !!organizer?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("organizers");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: Organizer },
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
      toast.success(`Organizer ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const organizerParsed = await insertOrganizerParams.safeParseAsync({ ...payload });
    if (!organizerParsed.success) {
      setErrors(organizerParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = organizerParsed.data;
    const pendingOrganizer: Organizer = {
      status: organizer?.status ?? "unvalidated",
      id: organizer?.id ?? "",
      userId: organizer?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingOrganizer,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateOrganizerAction({ ...values, id: organizer.id })
          : await createOrganizerAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingOrganizer
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
          name="organizerName"
          label="Organizer Name"
          required
          isInvalid={errors?.organizerName ? true : false}
          errorMessage={`${errors?.organizerName}`}
          defaultValue={organizer?.organizerName ?? ""}
        />
      </div>
      <div>
      <NextInput
          type="text"
          name="trustedContact"
          label="Trusted Contact"
          required
          isInvalid={errors?.trustedContact ? true : false}
          errorMessage={`${errors?.trustedContact}`}
          defaultValue={organizer?.trustedContact ?? ""}
        />
       
      </div>
     
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
              addOptimistic && addOptimistic({ action: "delete", data: organizer });
              const error = await deleteOrganizerAction(organizer.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: organizer,
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

export default OrganizerForm;

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
