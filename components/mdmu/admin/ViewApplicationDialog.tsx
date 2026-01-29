import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MDMUResponse } from "@/components/mdmu/mdmu/components/mdmu-form/types";
import { STATUS_COLORS, API_BASE_URL } from "./constants";
import { formatBoolean } from "./utils";

interface ViewApplicationDialogProps {
  application: MDMUResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewApplicationDialog({
  application,
  isOpen,
  onClose,
}: ViewApplicationDialogProps) {
  if (!application) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
          <DialogDescription>
            View complete application information for{" "}
            {application.name_of_company}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          {/* Company Logo */}
          {application.company_logo &&
            typeof application.company_logo === "object" &&
            "logo" in application.company_logo && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Company Logo
                  </h3>
                  <div className="flex justify-center">
                    <div className="relative w-full max-w-xs h-48 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                      <img
                        src={`${API_BASE_URL}/${
                          (application.company_logo as { logo: string }).logo
                        }`}
                        alt={
                          (application.company_logo as { name?: string })
                            .name || "Company Logo"
                        }
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML =
                              '<p class="text-sm text-gray-400">Failed to load logo</p>';
                          }
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Company Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Company Information
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Company Name
                  </label>
                  <p className="text-sm text-gray-900">
                    {application.name_of_company || "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Province
                  </label>
                  <p className="text-sm text-gray-900">
                    {application.address_province || "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    District
                  </label>
                  <p className="text-sm text-gray-900">
                    {application.address_district || "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Municipality
                  </label>
                  <p className="text-sm text-gray-900">
                    {application.address_municipality || "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Ward
                  </label>
                  <p className="text-sm text-gray-900">
                    {application.address_ward || "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Street Address
                  </label>
                  <p className="text-sm text-gray-900">
                    {application.address_street || "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Contact Person
                  </label>
                  <p className="text-sm text-gray-900">
                    {application.contact_name || "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Contact Number
                  </label>
                  <p className="text-sm text-gray-900">
                    {application.contact_number || "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Designation
                  </label>
                  <p className="text-sm text-gray-900">
                    {application.contact_designation || "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Alternate Number
                  </label>
                  <p className="text-sm text-gray-900">
                    {application.contact_alternate_number || "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-sm text-gray-900">
                    {application.contact_email || "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Details */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Business Details
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Industry Category
                  </label>
                  <p className="text-sm text-gray-900">
                    {application.nature_of_industry_sub_category_detail
                      ?.category?.name || "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Sub Category
                  </label>
                  <p className="text-sm text-gray-900">
                    {application.nature_of_industry_sub_category_detail?.name ||
                      "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Product Market
                  </label>
                  <p className="text-sm text-gray-900">
                    {application.product_market || "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Raw Material
                  </label>
                  <p className="text-sm text-gray-900">
                    {application.raw_material || "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Industry Size
                  </label>
                  <p className="text-sm text-gray-900">
                    {application.industry_size || "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Additional Information
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Member of CIM
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatBoolean(application.member_of_cim)}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Know About MDMU
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatBoolean(application.know_about_mdmu)}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Already Used Logo
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatBoolean(application.already_used_logo)}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Interested in Logo
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatBoolean(application.interested_in_logo)}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Self Declaration
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatBoolean(application.self_declaration)}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Status
                  </label>
                  <p className="text-sm">
                    <Badge
                      className={
                        STATUS_COLORS[
                          application.status as keyof typeof STATUS_COLORS
                        ] || "bg-gray-100 text-gray-800"
                      }
                    >
                      {application.status || "-"}
                    </Badge>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
