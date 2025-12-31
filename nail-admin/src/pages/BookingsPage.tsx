import type { ColumnDef } from "@tanstack/react-table";

import { format } from "date-fns";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import type {
  Booking,
  BookingStatus as BookingStatusType,
} from "@/types/booking.types";

import { BookingDetailsModal, StatusFilter } from "@/components/bookings";
import {
  DataTable,
  DataTableColumnHeader,
} from "@/components/layout/shared/DataTable";
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
import { bookingsService } from "@/services/bookings.service";
import { useBookingsStore } from "@/store/bookingsStore";

export function BookingsPage() {
  const bookings = useBookingsStore((state) => state.bookings);
  const initializeBookings = useBookingsStore(
    (state) => state.initializeBookings,
  );

  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | undefined>();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState<BookingStatusType | "all">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearch = useDebounce(searchQuery, 300);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const data = await bookingsService.getAll();
      useBookingsStore.getState().setBookings(data);
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast.error("Failed to load bookings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeBookings();
    loadBookings();
  }, [initializeBookings]);

  const handleRowClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  // Filter and search logic
  const filteredBookings = useMemo(() => {
    let items = bookings;

    // Filter by status
    if (activeStatus !== "all") {
      items = items.filter((booking) => booking.status === activeStatus);
    }

    // Filter by search query (customer name, email, phone)
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      items = items.filter(
        (booking) =>
          booking.customerInfo.firstName.toLowerCase().includes(query) ||
          booking.customerInfo.lastName.toLowerCase().includes(query) ||
          booking.customerInfo.email.toLowerCase().includes(query) ||
          booking.customerInfo.phone.toLowerCase().includes(query),
      );
    }

    return items;
  }, [bookings, activeStatus, debouncedSearch]);

  // Calculate status counts
  const statusCounts = useMemo(() => {
    const counts: Record<BookingStatusType | "all", number> = {
      all: bookings.length,
      cancelled: 0,
      completed: 0,
      confirmed: 0,
      pending: 0,
    };

    bookings.forEach((booking) => {
      counts[booking.status]++;
    });

    return counts;
  }, [bookings]);

  // Define table columns
  const columns: ColumnDef<Booking>[] = useMemo(
    () => [
      {
        accessorFn: (row) => row.date,
        cell: ({ row }) => (
          <div className="whitespace-nowrap">
            {format(new Date(row.original.date), "MMM d, yyyy")}
          </div>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Date" />
        ),
        id: "date",
      },
      {
        accessorFn: (row) => row.timeSlot.time,
        cell: ({ row }) => (
          <div className="whitespace-nowrap">{row.original.timeSlot.time}</div>
        ),
        header: "Time",
        id: "time",
      },
      {
        accessorFn: (row) =>
          `${row.customerInfo.firstName} ${row.customerInfo.lastName}`,
        cell: ({ row }) => (
          <div>
            <p className="font-medium">
              {row.original.customerInfo.firstName}{" "}
              {row.original.customerInfo.lastName}
            </p>
            <p className="text-xs text-muted-foreground">
              {row.original.customerInfo.email}
            </p>
          </div>
        ),
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Customer" />
        ),
        id: "customer",
      },
      {
        accessorFn: (row) => row.customerInfo.phone,
        cell: ({ row }) => (
          <div className="whitespace-nowrap">
            {row.original.customerInfo.phone}
          </div>
        ),
        header: "Phone",
        id: "phone",
      },
      {
        accessorFn: (row) => row.serviceId,
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {row.original.serviceId}
          </div>
        ),
        header: "Service",
        id: "service",
      },
      {
        accessorFn: (row) => row.status,
        cell: ({ row }) => (
          <StatusBadge status={row.original.status} variant="booking" />
        ),
        header: "Status",
        id: "status",
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bookings Management
          </h1>
          <p className="text-muted-foreground">
            View and manage customer bookings
          </p>
        </div>
      </div>

      {/* Status Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter by Status</CardTitle>
          <CardDescription>
            View bookings by their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StatusFilter
            activeStatus={activeStatus}
            statusCounts={statusCounts}
            onStatusChange={setActiveStatus}
          />
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Bookings</CardTitle>
              <CardDescription>
                {filteredBookings.length} of {bookings.length} bookings
              </CardDescription>
            </div>
            <div className="w-full max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by customer name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Loading bookings...
                </p>
              </div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">
                  {searchQuery || activeStatus !== "all"
                    ? "No bookings found matching your filters"
                    : "No bookings found"}
                </p>
              </div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredBookings}
              onRowClick={handleRowClick}
            />
          )}
        </CardContent>
      </Card>

      <BookingDetailsModal
        booking={selectedBooking}
        open={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onSuccess={loadBookings}
      />
    </div>
  );
}
