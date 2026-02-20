import type { NailShapeItem, NailStyleItem } from "@repo/types/nail-options";

import { Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDeleteNailShape, useDeleteNailStyle, useNailShapes, useNailStyles } from "@/hooks/api/useNailOptions";

import { NailOptionFormModal } from "./NailOptionFormModal";

function NailOptionList({
  isPendingDelete,
  items,
  label,
  onAdd,
  onDelete,
  onEdit,
}: {
  isPendingDelete: boolean;
  items: (NailShapeItem | NailStyleItem)[];
  label: string;
  onAdd: () => void;
  onDelete: (item: NailShapeItem | NailStyleItem) => void;
  onEdit: (item: NailShapeItem | NailStyleItem) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{label} Management</CardTitle>
            <CardDescription>{items.length} {label.toLowerCase()}(s)</CardDescription>
          </div>
          <Button size="sm" onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add {label}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">No {label.toLowerCase()}s yet</p>
              <Button onClick={onAdd} className="mt-4" size="sm">
                <Plus className="mr-2 h-4 w-4" />Create First
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item._id}
                className="flex items-center justify-between gap-4 rounded-lg border p-3 hover:bg-muted/50"
              >
                <div className="flex flex-1 items-center gap-3">
                  <Badge variant="outline" className="font-mono text-xs">{item.value}</Badge>
                  <div>
                    <span className="font-medium">{item.label}</span>
                    <span className="ml-2 text-sm text-muted-foreground">({item.labelVi})</span>
                  </div>
                  {!item.isActive && (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="icon"
                    className="text-destructive hover:text-destructive"
                    disabled={isPendingDelete}
                    onClick={() => onDelete(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function NailOptionsTab() {
  const { data: shapesData } = useNailShapes();
  const { data: stylesData } = useNailStyles();
  const deleteShape = useDeleteNailShape();
  const deleteStyle = useDeleteNailStyle();

  const shapes = shapesData?.data ?? [];
  const styles = stylesData?.data ?? [];

  const [formOpen, setFormOpen] = useState(false);
  const [formType, setFormType] = useState<"shape" | "style">("shape");
  const [editItem, setEditItem] = useState<NailShapeItem | NailStyleItem | undefined>();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{ id: string; type: "shape" | "style" } | null>(null);

  const handleAdd = (type: "shape" | "style") => {
    setFormType(type);
    setEditItem(undefined);
    setFormOpen(true);
  };

  const handleEdit = (item: NailShapeItem | NailStyleItem, type: "shape" | "style") => {
    setFormType(type);
    setEditItem(item);
    setFormOpen(true);
  };

  const handleDeleteRequest = (item: NailShapeItem | NailStyleItem, type: "shape" | "style") => {
    setDeleteItem({ id: item._id, type });
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteItem) return;
    if (deleteItem.type === "shape") {
      deleteShape.mutate(deleteItem.id, { onSuccess: () => setDeleteOpen(false) });
    } else {
      deleteStyle.mutate(deleteItem.id, { onSuccess: () => setDeleteOpen(false) });
    }
  };

  return (
    <div className="space-y-6">
      <NailOptionList
        items={shapes}
        isPendingDelete={deleteShape.isPending}
        label="Nail Shape"
        onAdd={() => handleAdd("shape")}
        onDelete={(item) => handleDeleteRequest(item, "shape")}
        onEdit={(item) => handleEdit(item, "shape")}
      />

      <NailOptionList
        items={styles}
        isPendingDelete={deleteStyle.isPending}
        label="Nail Style"
        onAdd={() => handleAdd("style")}
        onDelete={(item) => handleDeleteRequest(item, "style")}
        onEdit={(item) => handleEdit(item, "style")}
      />

      <NailOptionFormModal
        item={editItem}
        open={formOpen}
        type={formType}
        onOpenChange={setFormOpen}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteItem?.type === "shape" ? "Nail Shape" : "Nail Style"}</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this option. Gallery items referencing this value will keep their current value but it won't appear in filters.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteConfirm}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
