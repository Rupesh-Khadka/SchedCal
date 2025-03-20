"use client";

import { Switch } from "@/components/ui/switch";
import React, { useEffect, useTransition } from "react";
import { UpdateEvenTypeStatusAction } from "../action";
import { toast } from "sonner";

export function MenuActiveSwtich({
  initialChecked,
  eventTypeId,
}: {
  initialChecked: boolean;
  eventTypeId: string;
}) {
  const [isPending, startTransition] = useTransition();

  const [state, action] = React.useActionState(
    UpdateEvenTypeStatusAction,
    undefined
  );

  useEffect(() => {
    if (state?.status == "success") {
      toast.success(state.message);
    } else if (state?.message == "error") {
      toast.error(state.message);
    }
  }, [state]);
  return (
    <Switch
      disabled={isPending}
      defaultChecked={initialChecked}
      onCheckedChange={(isChecked) => {
        startTransition(() => {
          action({
            eventTypeId: eventTypeId,
            isChecked: isChecked,
          });
        });
      }}
    />
  );
}
