import { createMeetingAction } from "@/app/action";
import { RenderCalendar } from "@/app/components/bookingForm/RenderCalendar";
import { TimeTable } from "@/app/components/bookingForm/TimeTable";
import { SubmitButton } from "@/app/components/SubmitButton";
import { prisma } from "@/app/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CalendarX2, Clock, VideoIcon } from "lucide-react";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    userName: string;
    eventUrl: string;
  }>;
  searchParams: Promise<{
    date?: string;
    time?: string;
  }>;
}

async function getData(eventUrl: string, userName: string) {
  const data = await prisma.eventType.findFirst({
    where: {
      url: eventUrl,
      User: {
        userName: userName,
      },
      active: true,
    },
    select: {
      id: true,
      description: true,
      title: true,
      duration: true,
      videoCallSoftware: true,
      User: {
        select: {
          image: true,
          name: true,
          availability: {
            select: {
              day: true,
              isActive: true,
            },
            orderBy: {
              day: "asc",
            },
          },
        },
      },
    },
  });

  if (!data) {
    notFound();
  }
  return data;
}

export default async function BookingFormRoute({
  params,
  searchParams,
}: PageProps) {
  const { eventUrl, userName } = await params;
  const { date, time } = await searchParams;
  const data = await getData(eventUrl, userName);
  const selectedDate = date
    ? new Date(date)
    : new Date();

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(selectedDate);

  const showForm = !!date && !!time;

  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      {showForm ? (
        <Card className="max-w-[600px] w-full">
          <CardContent className="px-5 md:flex justify-between gap-8">
            <div className="w-full ">
              <img
                src={data.User?.image || "/default-avatar.png"}
                alt="Profile"
                className="size-10 rounded-full"
              />
              <p className="text-sm font-medium text-muted-foreground mt-1">
                {data.User?.name}
              </p>
              <h1 className="text-xl font-semibold mt-2">{data.title}</h1>
              <p className="text-sm font-medium text-muted-foreground">
                {data.description}
              </p>

              <div className="mt-5 flex flex-col gap-y-3">
                <p className="flex items-center">
                  <CalendarX2 className="size-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {formattedDate}
                  </span>
                </p>

                <p className="flex items-center">
                  <Clock className="size-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {data.duration} Minutes
                  </span>
                </p>

                <p className="flex items-center">
                  <VideoIcon className="size-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {data.videoCallSoftware}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex">
              <Separator orientation="vertical" className="h-full w-[1px]" />
            </div>
            <form
              className="flex flex-col gap-y-4 w-full"
              action={createMeetingAction}
            >
              <input type="hidden" name="fromTime" value={time} />
              <input type="hidden" name="eventDate" value={date} />
              <input type="hidden" name="meetingLength" value={data.duration} />
              <input
                type="hidden"
                name="provider"
                value={data.videoCallSoftware}
              />
              <input type="hidden" name="userName" value={userName} />
              <input type="hidden" name="eventTypeId" value={data.id} />

              <div className="flex flex-col gap-y-2">
                <Label>Your Name</Label>
                <Input name="name" placeholder="Your Name" required />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label>Your Email</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="example@domain.com"
                  required
                />
              </div>
              <SubmitButton className="w-full mt-5" text="Book Meeting" />
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-[1000px] mx-auto">
          <CardContent className="px-5 md:flex justify-between gap-4">
            <div className="w-full">
              <img
                src={data.User?.image || "/default-avatar.png"}
                alt="Profile"
                className="size-10 rounded-full"
              />
              <p className="text-sm font-medium text-muted-foreground mt-1">
                {data.User?.name}
              </p>
              <h1 className="text-xl font-semibold mt-2">{data.title}</h1>
              <p className="text-sm font-medium text-muted-foreground">
                {data.description}
              </p>

              <div className="mt-5 flex flex-col gap-y-3">
                <p className="flex items-center">
                  <CalendarX2 className="size-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {formattedDate}
                  </span>
                </p>

                <p className="flex items-center">
                  <Clock className="size-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {data.duration} Minutes
                  </span>
                </p>

                <p className="flex items-center">
                  <VideoIcon className="size-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {data.videoCallSoftware}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex w-full gap-4">
              <Separator orientation="vertical" className="h-full w-[1px]" />
              <RenderCalendar availability={data.User?.availability || []} />
              <Separator orientation="vertical" className="h-full w-[1px]" />
            </div>
            <div className="w-full">
              <TimeTable
                duration={data.duration}
                selectedDate={selectedDate}
                userName={userName}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
