import { Loader2, Trash2, Upload, Video } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { imageUploadService } from "@/services/imageUpload.service";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm"];

export type VideoUploadProps = {
  className?: string;
  folder: "banners" | "services" | "gallery";
  onChange: (url: string) => void;
  value?: string;
};

export const VideoUpload = React.forwardRef<HTMLDivElement, VideoUploadProps>(
  ({ className, folder, onChange, value }, ref) => {
    const [isUploading, setIsUploading] = React.useState(false);
    const [uploadProgress, setUploadProgress] = React.useState(0);
    const [isDragging, setIsDragging] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const videoRef = React.useRef<HTMLVideoElement>(null);

    const validateFile = (file: File): string | null => {
      if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
        return "Invalid file type. Please upload MP4 or WebM videos.";
      }
      if (file.size > MAX_FILE_SIZE) {
        return "File size exceeds 50MB. Please choose a smaller file.";
      }
      return null;
    };

    const handleUpload = async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        const url = await imageUploadService.uploadVideo(
          file,
          folder,
          (progress) => {
            setUploadProgress(progress);
          },
        );
        onChange(url);
        toast.success("Video uploaded successfully!");
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload video. Please try again.");
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleUpload(file);
      }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleUpload(file);
      }
    };

    const handleDelete = async () => {
      if (!value) return;

      try {
        await imageUploadService.deleteVideo(value);
        onChange("");
        toast.success("Video removed successfully!");
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to remove video. Please try again.");
      }
    };

    const handleReplace = () => {
      inputRef.current?.click();
    };

    return (
      <div ref={ref} className={cn("w-full", className)}>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_VIDEO_TYPES.join(",")}
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />

        {value ? (
          <div className="relative">
            <div className="relative overflow-hidden rounded-lg border border-border bg-muted">
              <video
                ref={videoRef}
                src={value}
                controls
                className="h-64 w-full object-cover"
              >
                Your browser does not support the video tag.
              </video>
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
            </div>
            {!isUploading && (
              <div className="mt-2 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleReplace}
                  className="flex-1"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Replace
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  className="flex-1"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={() => !isUploading && inputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 transition-colors hover:bg-muted",
              isDragging && "border-primary bg-primary/10",
              isUploading && "cursor-not-allowed opacity-50",
            )}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                <div className="w-full max-w-xs">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-center text-sm text-muted-foreground">
                    Uploading... {Math.round(uploadProgress)}%
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-full bg-primary/10 p-3">
                  <Video className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">
                    Drag and drop or click to upload
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    MP4 or WebM (max 50MB)
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  },
);
VideoUpload.displayName = "VideoUpload";
