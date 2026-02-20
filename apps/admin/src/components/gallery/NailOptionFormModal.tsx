import type { NailShapeItem, NailStyleItem } from "@repo/types/nail-options";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  useCreateNailShape,
  useCreateNailStyle,
  useUpdateNailShape,
  useUpdateNailStyle,
} from "@/hooks/api/useNailOptions";

const nailOptionSchema = z.object({
  isActive: z.boolean(),
  label: z.string().min(1, "English label is required").max(50),
  labelVi: z.string().min(1, "Vietnamese label is required").max(50),
  sortIndex: z.number().min(0),
  value: z.string().min(1, "Value (slug) is required").max(50)
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, hyphens"),
});

type NailOptionFormValues = z.infer<typeof nailOptionSchema>;

export type NailOptionFormModalProps = {
  item?: NailShapeItem | NailStyleItem;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  open: boolean;
  type: "shape" | "style";
};

export function NailOptionFormModal({
  item,
  onOpenChange,
  onSuccess,
  open,
  type,
}: NailOptionFormModalProps) {
  const isEditMode = !!item;
  const label = type === "shape" ? "Nail Shape" : "Nail Style";

  const createShape = useCreateNailShape();
  const updateShape = useUpdateNailShape();
  const createStyle = useCreateNailStyle();
  const updateStyle = useUpdateNailStyle();

  const isPending =
    createShape.isPending || updateShape.isPending ||
    createStyle.isPending || updateStyle.isPending;

  const form = useForm<NailOptionFormValues>({
    defaultValues: { isActive: true, label: "", labelVi: "", sortIndex: 0, value: "" },
    resolver: zodResolver(nailOptionSchema),
  });

  useEffect(() => {
    if (item && open) {
      form.reset({
        isActive: item.isActive,
        label: item.label,
        labelVi: item.labelVi,
        sortIndex: item.sortIndex,
        value: item.value,
      });
    } else if (!open) {
      form.reset({ isActive: true, label: "", labelVi: "", sortIndex: 0, value: "" });
    }
  }, [item, open, form]);

  const onSubmit = (data: NailOptionFormValues) => {
    const onSuccess_ = () => {
      onSuccess?.();
      onOpenChange(false);
    };

    if (isEditMode) {
      if (type === "shape") {
        updateShape.mutate({ data, id: item._id }, { onSuccess: onSuccess_ });
      } else {
        updateStyle.mutate({ data, id: item._id }, { onSuccess: onSuccess_ });
      }
    } else {
      if (type === "shape") {
        createShape.mutate(data, { onSuccess: onSuccess_ });
      } else {
        createStyle.mutate(data, { onSuccess: onSuccess_ });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? `Edit ${label}` : `Create ${label}`}</DialogTitle>
          <DialogDescription>
            {isEditMode ? `Update ${label.toLowerCase()} details` : `Add a new ${label.toLowerCase()}`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="value" render={({ field }) => (
              <FormItem>
                <FormLabel>Value (Slug) *</FormLabel>
                <FormControl>
                  <Input placeholder="almond" disabled={isEditMode} {...field} />
                </FormControl>
                <FormDescription>URL-safe identifier. Cannot change after creation.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="label" render={({ field }) => (
              <FormItem>
                <FormLabel>English Label *</FormLabel>
                <FormControl><Input placeholder="Almond" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="labelVi" render={({ field }) => (
              <FormItem>
                <FormLabel>Vietnamese Label *</FormLabel>
                <FormControl><Input placeholder="Móng Hạnh Nhân" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="sortIndex" render={({ field }) => (
              <FormItem>
                <FormLabel>Sort Order</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="isActive" render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Active</FormLabel>
                  <FormDescription>Show in filter options</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : isEditMode ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
