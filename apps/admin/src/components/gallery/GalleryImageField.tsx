import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type GalleryImageFieldProps = {
  imagePreview: string;
  isEditMode: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function GalleryImageField({
  imagePreview,
  isEditMode,
  onFileChange,
}: GalleryImageFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="image">
        Image {!isEditMode && <span className="text-destructive">*</span>}
      </Label>
      {isEditMode && imagePreview && (
        <div className="mb-2 overflow-hidden rounded-lg border border-border">
          <img src={imagePreview} alt="Current" className="h-48 w-full object-cover" />
          <p className="bg-muted p-2 text-xs text-muted-foreground">
            Current image. To change, delete and recreate the item.
          </p>
        </div>
      )}
      {!isEditMode && (
        <>
          <Input
            id="image"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={onFileChange}
            className="cursor-pointer"
          />
          {imagePreview && (
            <div className="mt-2 overflow-hidden rounded-lg border border-border">
              <img src={imagePreview} alt="Preview" className="h-48 w-full object-cover" />
            </div>
          )}
          <p className="text-xs text-muted-foreground">Max 10MB — JPG, PNG, WebP</p>
        </>
      )}
    </div>
  );
}
