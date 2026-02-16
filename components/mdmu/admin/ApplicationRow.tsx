import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
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
    <TableRow
      key={application.id}
      className="border-0 transition-colors hover:bg-slate-50/50"
    >
      <TableCell className="px-4 py-3 text-sm font-medium text-slate-900">
        {application.name_of_company}
      </TableCell>
      <TableCell className="px-4 py-3 text-sm text-slate-600">
        {application.nature_of_industry_sub_category_detail?.category?.name ||
          "—"}
      </TableCell>
      <TableCell className="px-4 py-3 text-sm text-slate-600">
        {application.contact_email || "—"}
      </TableCell>
      <TableCell className="px-4 py-3">
        <Badge
          className={
            STATUS_COLORS[application.status as keyof typeof STATUS_COLORS] ||
            "bg-slate-100 text-slate-800"
          }
        >
          {application.status}
        </Badge>
      </TableCell>
      <TableCell className="px-4 py-3 text-right">
        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            onClick={() => onView(application)}
            className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            View
          </button>
          {application.status === "Approved" && application.file_url && (
            <button
              type="button"
              onClick={() =>
                onPrint(`https://cim.baliyoventures.com${application.file_url}`)
              }
              className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Print
            </button>
          )}
          <button
            type="button"
            onClick={() => onEdit(application)}
            className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Update status
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
}
