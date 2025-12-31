import { Archive, Mail, MailCheck, MailOpen } from "lucide-react";

import type { ContactStatus } from "@/types/contact.types";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StatusFilterProps = {
  onStatusChange: (status: ContactStatus | "all") => void;
  selectedStatus: ContactStatus | "all";
};

const statusOptions = [
  {
    icon: Mail,
    label: "All Messages",
    value: "all" as const,
  },
  {
    icon: Mail,
    label: "New",
    value: "new" as const,
  },
  {
    icon: MailOpen,
    label: "Read",
    value: "read" as const,
  },
  {
    icon: MailCheck,
    label: "Responded",
    value: "responded" as const,
  },
  {
    icon: Archive,
    label: "Archived",
    value: "archived" as const,
  },
];

export function StatusFilter({
  onStatusChange,
  selectedStatus,
}: StatusFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {statusOptions.map(({ icon: Icon, label, value }) => (
        <Button
          key={value}
          variant={selectedStatus === value ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusChange(value)}
          className={cn(
            "transition-all",
            selectedStatus === value && "shadow-sm",
          )}
        >
          <Icon className="mr-2 h-4 w-4" />
          {label}
        </Button>
      ))}
    </div>
  );
}
