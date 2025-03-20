import { updateAvalibilityAction } from "@/app/action";
import { SubmitButton } from "@/app/components/SubmitButton";
import { prisma } from "@/app/lib/db";
import { requireUser } from "@/app/lib/hooks";
import { times } from "@/app/lib/times";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { SelectValue } from "@radix-ui/react-select";
import { notFound } from "next/navigation";

async function getData(userId: string) {
  const data = await prisma.availability.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      day: "asc",
    },
  });

  if (!data) {
    return notFound();
  }
  return data;
}

export default async function AvaibilityRoute() {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avaibility</CardTitle>
        <CardDescription>
          In this section ypu can manage your availibity!
        </CardDescription>
      </CardHeader>
      <form action={updateAvalibilityAction}>
        <CardContent className="flex flex-col gap-y-4">
          {data.map((item) => (
            <div
              key={item.id}
              className="grid gird-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-4"
            >
              <input type="hidden" name={`id-${item.id}`} value={item.id} />

              <div className="flex items-center gap-x-3 ">
                <Switch
                  name={`isActive-${item.id}`}
                  defaultChecked={item.isActive}
                />
                <p>{item.day}</p>
              </div>

              <Select name={`fromTime-${item.id}`} defaultValue={item.fromTime}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="From Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {times.map((time) => (
                      <SelectItem key={time.id} value={time.time}>
                        {time.time}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select name={`tillTime-${item.id}`} defaultValue={item.tillTime}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Till Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {times.map((time) => (
                      <SelectItem key={time.id} value={time.time}>
                        {time.time}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <SubmitButton text="Save Changes" className="mt-4" />
        </CardFooter>
      </form>
    </Card>
  );
}
