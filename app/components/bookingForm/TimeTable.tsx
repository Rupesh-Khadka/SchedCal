import { prisma } from "@/app/lib/db";
import { nylas } from "@/app/lib/nylas";
import { Button } from "@/components/ui/button";
import { Prisma } from "@prisma/client";
import {
  addMinutes,
  format,
  fromUnixTime,
  getDate,
  isAfter,
  isBefore,
  parse,
} from "date-fns";
import Link from "next/link";
import { GetFreeBusyRequest, GetFreeBusyResponse, NylasResponse } from "nylas";

async function getData(userName: string, selectedDate: Date) {
  const currentDate = format(selectedDate, "EEEE");

  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

  const data = await prisma.availability.findFirst({
    where: {
      day: currentDate as Prisma.EnumDayFilter,
      User: {
        userName: userName,
      },
    },
    select: {
      fromTime: true,
      tillTime: true,
      id: true,
      User: {
        select: {
          grantEmail: true,
          grantId: true,
        },
      },
    },
  });
  const nylasCalendarData = await nylas.calendars.getFreeBusy({
    identifier: data?.User?.grantId as string,
    requestBody: {
      startTime: Math.floor(startOfDay.getTime() / 1000),
      endTime: Math.floor(endOfDay.getTime() / 1000),
      emails: [data?.User?.grantEmail as string],
    },
  });

  return { data, nylasCalendarData };
}

interface iAppProps {
  selectedDate: Date;
  userName: string;
  duration: number;
}

function calculationAvaliableTimeSlots(
  date: string,
  dbAvaliablity: {
    fromTime: string | undefined;
    tillTime: string | undefined;
  },
  nylasData: NylasResponse<GetFreeBusyResponse[]>,

  duration: number
) {
  const now = new Date();
  const avaliableFrom = parse(
    `${date} ${dbAvaliablity.fromTime}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );

  const avaliableTill = parse(
    `${date} ${dbAvaliablity.tillTime}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );
  //@ts-ignore
  const busySlots = nylasData.data[0].timeSlots.map((slot) => ({
    start: fromUnixTime(slot.startTime),
    end: fromUnixTime(slot.endTime),
  }));

  const allSlots = [];
  let currentSlots = avaliableFrom;
  while (isBefore(currentSlots, avaliableTill)) {
    allSlots.push(currentSlots);
    currentSlots = addMinutes(currentSlots, duration);
  }
  const freeSlot = allSlots.filter((slot) => {
    const slotEnd = addMinutes(slot, duration);
    return (
      isAfter(slot, now) &&
      !busySlots.some(
        (busy: { start: any; end: any }) =>
          (!isBefore(slot, busy.start) && isBefore(slot, busy.end)) ||
          (isAfter(slotEnd, busy.start) && !isAfter(slotEnd, busy.end)) ||
          (isBefore(slot, busy.start) && isAfter(slotEnd, busy.end))
      )
    );
  });
  return freeSlot.map((slot) => format(slot, "HH:mm"));
}

export async function TimeTable({
  selectedDate,
  userName,
  duration,
}: iAppProps) {
  const { data, nylasCalendarData } = await getData(userName, selectedDate);

  const formattedDate = format(selectedDate, "yyyy-MM-dd");
  const dbAvaliablity = { fromTime: data?.fromTime, tillTime: data?.tillTime };

  const availableSlots = calculationAvaliableTimeSlots(
    formattedDate,
    dbAvaliablity,
    nylasCalendarData,
    duration
  );

  return (
    <div>
      <p className="text-base font-semibold">
        {format(selectedDate, "EEE")}{" "}
        <span className="text-sm text-muted-foreground">
          {format(selectedDate, "MMM. d")}
        </span>
      </p>

      <div className="mt-3 max-h-[350px] overflow-y-auto">
        {availableSlots.length > 0 ? (
          availableSlots.map((slot, index) => (
            <Link
              href={`?date=${format(selectedDate, "yyyy-MM-dd")}&time=${slot}`}
              key={index}
            >
              <Button className="w-full mb-2" variant="outline">
                {slot}
              </Button>
            </Link>
          ))
        ) : (
          <p>No time slots available</p>
        )}
      </div>
    </div>
  );
}
