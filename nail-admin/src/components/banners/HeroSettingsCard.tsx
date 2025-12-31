import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  RotateCw,
  Video,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { Banner } from "@/types/banner.types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { bannersService } from "@/services/banners.service";
import { heroSettingsService } from "@/services/heroSettings.service";
import { HERO_DISPLAY_MODES } from "@/types/heroSettings.types";

const heroSettingsSchema = z.object({
  carouselInterval: z
    .number()
    .min(2, "Interval must be at least 2 seconds")
    .max(10, "Interval must be at most 10 seconds"),
  displayMode: z.enum(["image", "video", "carousel"]),
  showControls: z.boolean(),
});

type HeroSettingsFormData = z.infer<typeof heroSettingsSchema>;

export type HeroSettingsCardProps = {
  onSettingsChange?: () => void;
};

export function HeroSettingsCard({ onSettingsChange }: HeroSettingsCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [primaryBanner, setPrimaryBanner] = useState<Banner | null>(null);

  const {
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<HeroSettingsFormData>({
    defaultValues: {
      carouselInterval: 5,
      displayMode: "carousel",
      showControls: true,
    },
    resolver: zodResolver(heroSettingsSchema),
  });

  const displayMode = watch("displayMode");
  const showControls = watch("showControls");
  const carouselInterval = watch("carouselInterval");

  // Load settings and primary banner
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [settings, banner] = await Promise.all([
        heroSettingsService.getSettings(),
        bannersService.getPrimary(),
      ]);

      setValue("displayMode", settings.displayMode);
      setValue("showControls", settings.showControls);
      setValue("carouselInterval", settings.carouselInterval / 1000); // Convert ms to seconds
      setPrimaryBanner(banner);
    } catch (error) {
      console.error("Error loading hero settings:", error);
      toast.error("Failed to load hero settings. Using defaults.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save on change
  const saveSettings = async (data: HeroSettingsFormData) => {
    setIsSaving(true);
    try {
      await heroSettingsService.updateSettings({
        carouselInterval: data.carouselInterval * 1000, // Convert seconds to ms
        displayMode: data.displayMode,
        showControls: data.showControls,
      });
      toast.success("Hero settings updated successfully!");
      onSettingsChange?.();
    } catch (error) {
      console.error("Error saving hero settings:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Watch for changes and auto-save
  useEffect(() => {
    if (!isLoading) {
      const subscription = watch(() => {
        handleSubmit(saveSettings)();
      });
      return () => subscription.unsubscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, watch, handleSubmit]);

  const handleReset = async () => {
    try {
      const settings = await heroSettingsService.resetSettings();
      setValue("displayMode", settings.displayMode);
      setValue("showControls", settings.showControls);
      setValue("carouselInterval", settings.carouselInterval / 1000);
      toast.success("Hero settings reset to defaults!");
      onSettingsChange?.();
    } catch (error) {
      console.error("Error resetting hero settings:", error);
      toast.error("Failed to reset settings. Please try again.");
    }
  };

  const showPrimaryWarning =
    (displayMode === HERO_DISPLAY_MODES.IMAGE ||
      displayMode === HERO_DISPLAY_MODES.VIDEO) &&
    !primaryBanner;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              Hero Display Settings
              {isSaving && (
                <span className="text-xs font-normal text-muted-foreground">
                  (Saving...)
                </span>
              )}
            </CardTitle>
            <CardDescription>
              Configure how banners are displayed in the hero section
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              disabled={isLoading || isSaving}
            >
              <RotateCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
              <span className="sr-only">
                {isCollapsed ? "Expand" : "Collapse"}
              </span>
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Loading settings...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Display Mode */}
              <div className="space-y-3">
                <Label>Display Mode</Label>
                <RadioGroup
                  value={displayMode}
                  onValueChange={(value) =>
                    setValue(
                      "displayMode",
                      value as "image" | "video" | "carousel",
                    )
                  }
                >
                  <div className="flex items-center space-x-2 rounded-lg border border-border p-3 transition-colors hover:bg-accent">
                    <RadioGroupItem
                      value={HERO_DISPLAY_MODES.IMAGE}
                      id="image"
                    />
                    <Label
                      htmlFor="image"
                      className="flex flex-1 cursor-pointer items-center gap-2"
                    >
                      <ImageIcon className="h-4 w-4" />
                      <div>
                        <p className="font-medium">Image</p>
                        <p className="text-xs text-muted-foreground">
                          Single static image from primary banner
                        </p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border border-border p-3 transition-colors hover:bg-accent">
                    <RadioGroupItem
                      value={HERO_DISPLAY_MODES.VIDEO}
                      id="video"
                    />
                    <Label
                      htmlFor="video"
                      className="flex flex-1 cursor-pointer items-center gap-2"
                    >
                      <Video className="h-4 w-4" />
                      <div>
                        <p className="font-medium">Video</p>
                        <p className="text-xs text-muted-foreground">
                          Single video background from primary banner
                        </p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border border-border p-3 transition-colors hover:bg-accent">
                    <RadioGroupItem
                      value={HERO_DISPLAY_MODES.CAROUSEL}
                      id="carousel"
                    />
                    <Label
                      htmlFor="carousel"
                      className="flex flex-1 cursor-pointer items-center gap-2"
                    >
                      <RotateCw className="h-4 w-4" />
                      <div>
                        <p className="font-medium">Carousel</p>
                        <p className="text-xs text-muted-foreground">
                          Rotating carousel of all active banners
                        </p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                {errors.displayMode && (
                  <p className="text-xs text-destructive">
                    {errors.displayMode.message}
                  </p>
                )}
              </div>

              {/* Primary Banner Warning */}
              {showPrimaryWarning && (
                <div className="flex items-start gap-2 rounded-lg border border-warning bg-warning/10 p-4">
                  <AlertCircle className="mt-0.5 h-4 w-4 text-warning-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-warning-foreground">
                      No primary banner selected
                    </p>
                    <p className="text-xs text-warning-foreground/80">
                      Please set a banner as primary to use Image or Video mode.
                      Go to the banners table below and click "Set as Primary"
                      on a banner.
                    </p>
                  </div>
                </div>
              )}

              {/* Primary Banner Preview */}
              {primaryBanner &&
                (displayMode === HERO_DISPLAY_MODES.IMAGE ||
                  displayMode === HERO_DISPLAY_MODES.VIDEO) && (
                  <div className="space-y-2">
                    <Label>Primary Banner Preview</Label>
                    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <img
                        src={primaryBanner.imageUrl}
                        alt={primaryBanner.title}
                        className="h-16 w-24 rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{primaryBanner.title}</p>
                      </div>
                    </div>
                  </div>
                )}

              {/* Carousel Settings */}
              {displayMode === HERO_DISPLAY_MODES.CAROUSEL && (
                <div className="space-y-4 rounded-lg border border-border p-4">
                  <h3 className="text-sm font-medium">Carousel Settings</h3>

                  {/* Carousel Interval */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="carouselInterval">
                        Interval (seconds)
                      </Label>
                      <span className="text-sm font-medium">
                        {carouselInterval}s
                      </span>
                    </div>
                    <input
                      type="range"
                      id="carouselInterval"
                      min={2}
                      max={10}
                      step={0.5}
                      value={carouselInterval}
                      onChange={(e) =>
                        setValue("carouselInterval", Number(e.target.value))
                      }
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
                    />
                    <p className="text-xs text-muted-foreground">
                      Time between slide transitions
                    </p>
                    {errors.carouselInterval && (
                      <p className="text-xs text-destructive">
                        {errors.carouselInterval.message}
                      </p>
                    )}
                  </div>

                  {/* Show Controls */}
                  <div className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="showControls">Show Navigation</Label>
                      <p className="text-xs text-muted-foreground">
                        Display arrows and dots for manual control
                      </p>
                    </div>
                    <Switch
                      id="showControls"
                      checked={showControls}
                      onCheckedChange={(checked) =>
                        setValue("showControls", checked)
                      }
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}
