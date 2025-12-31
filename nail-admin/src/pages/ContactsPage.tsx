import type { ColumnDef } from "@tanstack/react-table";

import { format } from "date-fns";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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
import { useDebounce } from "@/hooks/useDebounce";
import { contactsService } from "@/services/contacts.service";
import { useContactsStore } from "@/store/contactsStore";

export function ContactsPage() {
  const { initializeContacts } = useContactsStore();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [statusFilter, setStatusFilter] = useState<ContactStatus | "all">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Initialize contacts on mount
  useEffect(() => {
    initializeContacts();
  }, [initializeContacts]);

  // Fetch contacts from service
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  useEffect(() => {
    const loadContacts = async () => {
      const data = await contactsService.getAll();
      setAllContacts(data);
    };
    loadContacts();
  }, []);

  // Filter and search contacts
  const filteredContacts = useMemo(() => {
    let result = allContacts;

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((contact) => contact.status === statusFilter);
    }

    // Search across multiple fields
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(
        (contact) =>
          contact.firstName.toLowerCase().includes(query) ||
          contact.lastName.toLowerCase().includes(query) ||
          contact.email.toLowerCase().includes(query) ||
          contact.subject.toLowerCase().includes(query) ||
          contact.message.toLowerCase().includes(query) ||
          (contact.phone && contact.phone.toLowerCase().includes(query)),
      );
    }

    return result;
  }, [allContacts, statusFilter, debouncedSearch]);

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

  const handleContactUpdate = async () => {
    const data = await contactsService.getAll();
    setAllContacts(data);
  };

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
          <div className="text-muted-foreground text-sm">
            {filteredContacts.length === allContacts.length
              ? `Showing all ${allContacts.length} messages`
              : `Showing ${filteredContacts.length} of ${allContacts.length} messages`}
          </div>

          {/* Data Table */}
          <DataTable
            columns={columns}
            data={filteredContacts}
            onRowClick={(contact) => setSelectedContact(contact)}
          />
        </CardContent>
      </Card>

      {/* Contact Details Modal */}
      <ContactDetailsModal
        contact={selectedContact}
        open={!!selectedContact}
        onClose={() => setSelectedContact(null)}
        onUpdate={handleContactUpdate}
      />
    </div>
  );
}
