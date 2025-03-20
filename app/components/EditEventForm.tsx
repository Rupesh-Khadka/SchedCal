"use client";

import { EditEventTypeAction } from "@/app/action";
import { SubmitButton } from "@/app/components/SubmitButton";
import { eventTypeSchema } from "@/app/lib/zodSchemas";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/ButtonGroup";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import Link from "next/link";
import { useActionState, useState } from "react";

type VideoCallProvoider = "Zoom Meeting" | "Google Meet" | "Microsoft Teams";

interface iAppProps {
  id: string;
  title: string;
  url: string;
  description: string;
  duration: number;
  callProvider: string;
}

export function EditEventForm({
  callProvider,
  description,
  duration,
  id,
  title,
  url,
}: iAppProps) {
  const [activePlatform, setActivePlatform] = useState<VideoCallProvoider>(
    callProvider as VideoCallProvoider
  );

  const [lastResult, action] = useActionState(EditEventTypeAction, undefined);
  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: eventTypeSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <div className="w-full h-full flex flex-1 items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Edit appointment type</CardTitle>
          <CardDescription>
            Edit your appointment type that allows people to book you!
          </CardDescription>
        </CardHeader>
        <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
          <input type="hidden" name="id" value={id} />
          <CardContent className="grid gap-y-5">
            <div className="flex flex-col gap-y-2">
              <Label>Title</Label>
              <Input
                name={fields.title.name}
                key={fields.title.key}
                defaultValue={title}
                placeholder="30 minute meeting"
              />
              <p className="text-red-500 text-sm">{fields.title.errors}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>URl Slug </Label>
              <div className="flex rounded-md">
                <span
                  className="inline-flex items-center px-3 rounded-l-md border border-r-0 
                    border-muted bg-muted text-sm text-muted-foreground"
                >
                  SchedCal.com/
                </span>
                <Input
                  name={fields.url.name}
                  key={fields.url.key}
                  defaultValue={url}
                  className="rounded-l-none"
                  placeholder="Example-url-1"
                />
                <p className="text-red-500 text-sm">{fields.url.errors}</p>
              </div>
            </div>

            <div className="flex flex-col gap-y-2">
              <Label>Description</Label>
              <Textarea
                name={fields.description.name}
                key={fields.description.key}
                defaultValue={description}
                placeholder="Meet me in this meeting to meet me"
              />
              <p className="text-red-500 text-sm">
                {fields.description.errors}
              </p>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Duration</Label>
              <Select
                name={fields.duration.name}
                key={fields.duration.key}
                defaultValue={String(duration)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select duration" />
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>
                        <SelectItem value="15">15 Mins</SelectItem>
                        <SelectItem value="30">30 Mins</SelectItem>
                        <SelectItem value="45">45 Mins</SelectItem>
                        <SelectItem value="60">1 hours</SelectItem>
                      </SelectLabel>
                    </SelectGroup>
                  </SelectContent>
                </SelectTrigger>
              </Select>
              <p className="text-red-500 text-sm">{fields.duration.errors}</p>
            </div>
            <div className="grid gap-y-2">
              <Label>Video Call Provider</Label>
              <input
                type="hidden"
                name={fields.videoCallSoftware.name}
                value={activePlatform}
              />
              <ButtonGroup className="w-full flex justify-evenly gap-y-2">
                <Button
                  onClick={() => setActivePlatform("Zoom Meeting")}
                  className="w-1/3"
                  type="button"
                  variant={
                    activePlatform === "Zoom Meeting" ? "secondary" : "outline"
                  }
                >
                  Zoom
                </Button>
                <Button
                  type="button"
                  onClick={() => setActivePlatform("Google Meet")}
                  className="w-1/3"
                  variant={
                    activePlatform === "Google Meet" ? "secondary" : "outline"
                  }
                >
                  Google Meet
                </Button>
                <Button
                  type="button"
                  onClick={() => setActivePlatform("Microsoft Teams")}
                  className="w-1/3 "
                  variant={
                    activePlatform === "Microsoft Teams"
                      ? "secondary"
                      : "outline"
                  }
                >
                  Microsoft teams
                </Button>
              </ButtonGroup>
              <p className="text-red-500 text-sm">
                {fields.videoCallSoftware.errors}
              </p>
            </div>
          </CardContent>
          <CardFooter className="mt-6 w-full flex items-center justify-between">
            <Button variant="secondary" asChild>
              <Link href="/dashboard">Cancle</Link>
            </Button>
            <SubmitButton text="Edit Event Type" />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
