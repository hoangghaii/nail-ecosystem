import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar, Mail, Phone, User } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { ContactStatusUpdate } from "@/lib/validations/contact.validation";
import type { Contact } from "@/types/contact.types";

import { StatusBadge } from "@/components/layout/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { contactStatusUpdateSchema } from "@/lib/validations/contact.validation";
import { contactsService } from "@/services/contacts.service";
import { ContactStatus } from "@/types/contact.types";

type ContactDetailsModalProps = {
  contact: Contact | null;
  onClose: () => void;
  onUpdate: () => void;
  open: boolean;
};

export function ContactDetailsModal({
  contact,
  onClose,
  onUpdate,
  open,
}: ContactDetailsModalProps) {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<ContactStatusUpdate>({
    defaultValues: {
      adminNotes: contact?.adminNotes || "",
      status: contact?.status || ContactStatus.NEW,
    },
    resolver: zodResolver(contactStatusUpdateSchema),
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedStatus = watch("status");

  // Reset form when contact changes
  useEffect(() => {
    if (contact) {
      reset({
        adminNotes: contact.adminNotes || "",
        status: contact.status,
      });
    }
  }, [contact, reset]);

  const onSubmit = async (data: ContactStatusUpdate) => {
    if (!contact) return;

    try {
      await contactsService.updateStatus(
        contact.id,
        data.status,
        data.adminNotes,
      );
      toast.success("Contact updated successfully");
      onUpdate();
      onClose();
    } catch (error) {
      toast.error("Failed to update contact");
      console.error("Error updating contact:", error);
    }
  };

  if (!contact) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contact Message Details</DialogTitle>
          <DialogDescription>
            View and manage customer contact messages
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              <StatusBadge variant="contact" status={contact.status} />
            </div>

            <div className="bg-muted/50 grid gap-3 rounded-lg p-4 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <User className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-muted-foreground text-xs">Name</p>
                  <p className="font-medium">
                    {contact.firstName} {contact.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-muted-foreground text-xs">Email</p>
                  <p className="font-medium">{contact.email}</p>
                </div>
              </div>

              {contact.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="text-muted-foreground h-4 w-4" />
                  <div>
                    <p className="text-muted-foreground text-xs">Phone</p>
                    <p className="font-medium">{contact.phone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-muted-foreground text-xs">Received</p>
                  <p className="font-medium">
                    {format(contact.createdAt, "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className="space-y-2">
            <Label>Subject</Label>
            <p className="text-foreground rounded-lg border p-3 font-medium">
              {contact.subject}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Message</Label>
            <div className="text-foreground max-h-40 overflow-y-auto rounded-lg border p-3">
              <p className="whitespace-pre-wrap">{contact.message}</p>
            </div>
          </div>

          {/* Response Information */}
          {contact.respondedAt && (
            <div className="bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 p-3 dark:border-green-900">
              <p className="text-green-700 dark:text-green-400 text-sm">
                <strong>Responded:</strong>{" "}
                {format(contact.respondedAt, "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          )}

          {/* Status Update */}
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={selectedStatus}
              onValueChange={(value) =>
                setValue("status", value as ContactStatusUpdate["status"])
              }
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ContactStatus.NEW}>
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-500 h-2 w-2 rounded-full" />
                    New
                  </div>
                </SelectItem>
                <SelectItem value={ContactStatus.READ}>
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-500 h-2 w-2 rounded-full" />
                    Read
                  </div>
                </SelectItem>
                <SelectItem value={ContactStatus.RESPONDED}>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-500 h-2 w-2 rounded-full" />
                    Responded
                  </div>
                </SelectItem>
                <SelectItem value={ContactStatus.ARCHIVED}>
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-500 h-2 w-2 rounded-full" />
                    Archived
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-destructive text-sm">
                {errors.status.message}
              </p>
            )}
          </div>

          {/* Admin Notes */}
          <div className="space-y-2">
            <Label htmlFor="adminNotes">Admin Notes</Label>
            <Textarea
              id="adminNotes"
              placeholder="Add internal notes about this contact (not visible to customer)"
              rows={4}
              {...register("adminNotes")}
            />
            {errors.adminNotes && (
              <p className="text-destructive text-sm">
                {errors.adminNotes.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
