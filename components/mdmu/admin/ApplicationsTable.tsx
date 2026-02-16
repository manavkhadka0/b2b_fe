import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MDMUResponse } from "@/components/mdmu/mdmu/components/mdmu-form/types";
import { ApplicationRow } from "./ApplicationRow";

interface ApplicationsTableProps {
  applications: MDMUResponse[];
  onView: (app: MDMUResponse) => void;
  onEdit: (app: MDMUResponse) => void;
  onPrint: (fileUrl: string) => void;
}

export function ApplicationsTable({
  applications,
  onView,
  onEdit,
  onPrint,
}: ApplicationsTableProps) {
  return (
    <Table className="min-w-full divide-y divide-slate-200">
      <TableHeader className="bg-slate-50">
        <TableRow className="border-0 hover:bg-transparent">
          <TableHead className="h-auto px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            Company
          </TableHead>
          <TableHead className="h-auto px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            Category
          </TableHead>
          <TableHead className="h-auto px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            Contact
          </TableHead>
          <TableHead className="h-auto px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            Status
          </TableHead>
          <TableHead className="h-auto px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-slate-100 bg-white">
        {applications.map((app) => (
          <ApplicationRow
            key={app.id}
            application={app}
            onView={onView}
            onEdit={onEdit}
            onPrint={onPrint}
          />
        ))}
      </TableBody>
    </Table>
  );
}
