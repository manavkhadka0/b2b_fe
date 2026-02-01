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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
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
