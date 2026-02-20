import type { NailShapeItem, NailStyleItem } from "@repo/types/nail-options";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type GalleryNailOptionsFieldsProps = {
  nailShape: string | undefined;
  nailStyle: string | undefined;
  shapes: NailShapeItem[];
  styles: NailStyleItem[];
  onShapeChange: (value: string) => void;
  onStyleChange: (value: string) => void;
};

export function GalleryNailOptionsFields({
  nailShape,
  nailStyle,
  shapes,
  styles,
  onShapeChange,
  onStyleChange,
}: GalleryNailOptionsFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Nail Shape (Optional)</Label>
        <Select
          value={nailShape || "none"}
          onValueChange={(v) => onShapeChange(v === "none" ? "" : v)}
        >
          <SelectTrigger><SelectValue placeholder="Select shape" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {shapes.map((s) => (
              <SelectItem key={s._id} value={s.value}>
                {s.label} ({s.labelVi})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Nail Style (Optional)</Label>
        <Select
          value={nailStyle || "none"}
          onValueChange={(v) => onStyleChange(v === "none" ? "" : v)}
        >
          <SelectTrigger><SelectValue placeholder="Select style" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {styles.map((s) => (
              <SelectItem key={s._id} value={s.value}>
                {s.label} ({s.labelVi})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
