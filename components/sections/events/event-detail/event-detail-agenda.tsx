import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Event } from "@/types/events";
import { HeaderSubtitle } from "../../common/header-subtitle";

const EventDetailAgenda = ({ event }: { event: Event }) => {
  return (
    <div className="space-y-4">
      <HeaderSubtitle
        title="Event Agenda and Responsibilities"
        subtitle="Here is the agenda and responsibilities for the event."
      />
      <div className="bg-white rounded-lg p-6 shadow overflow-x-auto">
        <Table>
          <TableCaption>Event Agenda and Responsibilities</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Time</TableHead>
              <TableHead>Topic to be discussed</TableHead>
              <TableHead className="text-right">Speakers</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {event?.agenda_items && event.agenda_items.length > 0 ? (
              event.agenda_items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.time}</TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside text-gray-600">
                      <p className="font-bold">{item.title}</p>
                      <div className="ml-3">
                        <li>{item.description}</li>
                      </div>
                    </ul>
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {item.speaker}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500">
                  No agenda items available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EventDetailAgenda;
