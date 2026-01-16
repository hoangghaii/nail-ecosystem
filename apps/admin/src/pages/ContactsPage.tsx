import type { ColumnDef } from "@tanstack/react-table";

import { useDebounce } from "@repo/utils/hooks";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import type { Contact, ContactStatus } from "@/types/contact.types";

import { BusinessInfoForm } from "@/components/contacts/BusinessInfoForm";
import { ContactDetailsModal } from "@/components/contacts/ContactDetailsModal";
import { StatusFilter } from "@/components/contacts/StatusFilter";
import { DataTable } from "@/components/layout/shared/DataTable";
import { StatusBadge } from "@/components/layout/shared/StatusBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useContacts } from "@/hooks/api/useContacts";

export function ContactsPage() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [statusFilter, setStatusFilter] = useState<ContactStatus | "all">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Backend filtering via hook params
  const { data, isFetching } = useContacts({
    limit: 100, // Fetch all for now
    search: debouncedSearch || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const allContacts: Contact[] = (data as Contact[]) || [];

  // Table columns definition
  const columns: ColumnDef<Contact>[] = useMemo(
    () => [
      {
        accessorKey: "createdAt",
        cell: ({ row }) => format(row.original.createdAt, "MMM d, yyyy"),
        header: "Date",
      },
      {
        accessorKey: "firstName",
        cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
        header: "Customer",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "phone",
        cell: ({ row }) => row.original.phone || "—",
        header: "Phone",
      },
      {
        accessorKey: "subject",
        cell: ({ row }) => (
          <span className="max-w-xs truncate" title={row.original.subject}>
            {row.original.subject}
          </span>
        ),
        header: "Subject",
      },
      {
        accessorKey: "status",
        cell: ({ row }) => (
          <StatusBadge variant="contact" status={row.original.status} />
        ),
        header: "Status",
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
        <p className="text-muted-foreground mt-2">
          Manage business contact information and customer messages
        </p>
      </div>

      {/* Business Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>Business Contact Information</CardTitle>
          <CardDescription>
            Update your business contact details displayed on the client website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BusinessInfoForm />
        </CardContent>
      </Card>

      {/* Customer Messages Section */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Messages</CardTitle>
          <CardDescription>
            View and manage messages from the "Send Us a Message" form on the
            client website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Filter */}
          <StatusFilter
            selectedStatus={statusFilter}
            onStatusChange={setStatusFilter}
          />

          {/* Search Input */}
          <div className="relative">
            <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search by name, email, subject, or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Results Count */}
          <div className="text-muted-foreground text-sm flex items-center gap-2">
            Showing {allContacts.length} messages
            {isFetching && (
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            )}
          </div>

          {/* Data Table */}
          <DataTable
            columns={columns}
            data={allContacts}
            onRowClick={(contact) => setSelectedContact(contact)}
          />
        </CardContent>
      </Card>

      {/* Contact Details Modal */}
      <ContactDetailsModal
        contact={selectedContact}
        open={!!selectedContact}
        onClose={() => setSelectedContact(null)}
      />
    </div>
  );
}
