import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, Printer, Eye } from "lucide-react";
import { MDMUResponse } from "@/components/mdmu/mdmu/components/mdmu-form/types";
import { STATUS_COLORS } from "./constants";

interface ApplicationRowProps {
  application: MDMUResponse;
  onView: (app: MDMUResponse) => void;
  onEdit: (app: MDMUResponse) => void;
  onPrint: (fileUrl: string) => void;
}

export function ApplicationRow({
  application,
  onView,
  onEdit,
  onPrint,
}: ApplicationRowProps) {
  return (
    <TableRow key={application.id}>
      <TableCell>{application.name_of_company}</TableCell>
      <TableCell>
        {application.nature_of_industry_sub_category_detail?.category?.name ||
          "N/A"}
      </TableCell>
      <TableCell>{application.contact_email}</TableCell>
      <TableCell>
        <Badge
          className={
            STATUS_COLORS[application.status as keyof typeof STATUS_COLORS] ||
            "bg-gray-100 text-gray-800"
          }
        >
          {application.status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => onView(application)}
            title="View Application"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {application.status === "Approved" && application.file_url && (
            <Button
              size="icon"
              variant="outline"
              onClick={() =>
                onPrint(`https://cim.baliyoventures.com${application.file_url}`)
              }
              title="Print Certificate"
            >
              <Printer className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="icon"
            variant="outline"
            onClick={() => onEdit(application)}
            title="Update Status"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
