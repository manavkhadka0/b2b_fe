"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { getContactsPaginated } from "@/services/contact";
import type { Contact } from "@/services/contact";
import { TablePagination } from "@/components/admin/TablePagination";
import { AdminTableWrapper } from "@/components/admin/AdminTableWrapper";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

export default function AdminContactsPage() {
  const router = useRouter();
  const { isAuthenticated, isChecking } = useAdminAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewContact, setViewContact] = useState<Contact | null>(null);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isChecking, router]);

  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoading(true);
      try {
        const data = await getContactsPaginated(page);
        setContacts(data.results || []);
        setCount(data.count ?? 0);
        setHasNext(!!data.next);
        setHasPrevious(!!data.previous);
        if ((data.results?.length ?? 0) > 0 && (data.next || page === 1)) {
          setPageSize(data.results!.length);
        }
      } catch (err) {
        console.error("Failed to fetch contacts:", err);
        setError("Failed to load contacts. Please try again.");
        setContacts([]);
        setCount(0);
        setHasNext(false);
        setHasPrevious(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchContacts();
    }
  }, [isAuthenticated, page]);

  if (!isAuthenticated && !isChecking) {
    return null;
  }

  return (
    <div className="min-w-0 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
          Contact Submissions
        </h2>
        <p className="text-sm text-slate-500">
          View contact form submissions from the website.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <AdminTableWrapper minWidthClass="min-w-[560px]">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Message
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  Loading contacts...
                </td>
              </tr>
            ) : contacts.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  No contact submissions found.
                </td>
              </tr>
            ) : (
              contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {contact.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {contact.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {contact.phone_number}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    <div
                      className="max-w-xs truncate"
                      title={contact.message}
                    >
                      {contact.message || "-"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {contact.created_at
                      ? format(new Date(contact.created_at), "MMM d, yyyy")
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    <button
                      onClick={() => setViewContact(contact)}
                      className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </AdminTableWrapper>

      {contacts.length > 0 && (
        <TablePagination
          page={page}
          count={count}
          resultsLength={contacts.length}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          pageSize={pageSize}
          onPageChange={setPage}
          entityLabel="contacts"
          isLoading={isLoading}
        />
      )}

      <Dialog
        open={!!viewContact}
        onOpenChange={(open) => !open && setViewContact(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Contact details</DialogTitle>
            <DialogDescription>
              {viewContact?.name} — {viewContact?.email}
            </DialogDescription>
          </DialogHeader>
          {viewContact && (
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="font-medium text-slate-500">Name</dt>
                <dd className="text-slate-900">{viewContact.name}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Email</dt>
                <dd className="text-slate-900">{viewContact.email}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Phone</dt>
                <dd className="text-slate-900">{viewContact.phone_number}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Date</dt>
                <dd className="text-slate-900">
                  {viewContact.created_at
                    ? format(
                        new Date(viewContact.created_at),
                        "MMM d, yyyy 'at' HH:mm",
                      )
                    : "-"}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Message</dt>
                <dd className="whitespace-pre-wrap text-slate-900">
                  {viewContact.message || "—"}
                </dd>
              </div>
            </dl>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
