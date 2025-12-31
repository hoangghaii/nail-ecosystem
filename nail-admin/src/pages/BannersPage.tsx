import type { ColumnDef } from "@tanstack/react-table";

import {
  Edit,
  GripVertical,
  MoreVertical,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { Banner } from "@/types/banner.types";

import {
  BannerFormModal,
  DeleteBannerDialog,
  HeroSettingsCard,
} from "@/components/banners";
import { DataTable } from "@/components/layout/shared/DataTable";
import { StatusBadge } from "@/components/layout/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bannersService } from "@/services/banners.service";
import { heroSettingsService } from "@/services/heroSettings.service";
import { useBannersStore } from "@/store/bannersStore";
import { useHeroSettingsStore } from "@/store/heroSettingsStore";

type BannerFilter = "all" | "active";

export function BannersPage() {
  const banners = useBannersStore((state) => state.banners);
  const initializeBanners = useBannersStore((state) => state.initializeBanners);
  const heroDisplayMode = useHeroSettingsStore(
    (state) => state.settings.displayMode,
  );
  const initializeSettings = useHeroSettingsStore(
    (state) => state.initializeSettings,
  );

  const [isLoading, setIsLoading] = useState(true);
  const [selectedBanner, setSelectedBanner] = useState<Banner | undefined>();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [bannerFilter, setBannerFilter] = useState<BannerFilter>("all");

  const loadBanners = async () => {
    setIsLoading(true);
    try {
      const data = await bannersService.getAll();
      useBannersStore.getState().setBanners(data);
    } catch (error) {
      console.error("Error loading banners:", error);
      toast.error("Failed to load banners. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadHeroSettings = async () => {
    try {
      await heroSettingsService.getSettings();
    } catch (error) {
      console.error("Error loading hero settings:", error);
    }
  };

  useEffect(() => {
    initializeBanners();
    initializeSettings();
    loadBanners();
    loadHeroSettings();
  }, [initializeBanners, initializeSettings]);

  const handleCreate = () => {
    setSelectedBanner(undefined);
    setIsFormModalOpen(true);
  };

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsFormModalOpen(true);
  };

  const handleDelete = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsDeleteDialogOpen(true);
  };

  const handleSetPrimary = async (banner: Banner) => {
    try {
      await bannersService.setPrimary(banner.id);
      toast.success("Primary banner updated successfully!");
      loadBanners();
    } catch (error) {
      console.error("Error setting primary banner:", error);
      toast.error("Failed to set primary banner. Please try again.");
    }
  };

  const handleToggleActive = async (banner: Banner) => {
    try {
      await bannersService.toggleActive(banner.id);
      toast.success(
        `Banner ${banner.active ? "deactivated" : "activated"} successfully!`,
      );
      loadBanners();
    } catch (error) {
      console.error("Error toggling banner status:", error);
      toast.error("Failed to update banner status. Please try again.");
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newBanners = [...banners];
    const draggedBanner = newBanners[draggedIndex];
    newBanners.splice(draggedIndex, 1);
    newBanners.splice(index, 0, draggedBanner);

    useBannersStore.getState().setBanners(newBanners);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex === null) return;

    try {
      const bannerIds = banners.map((b) => b.id);
      await bannersService.reorder(bannerIds);
      toast.success("Banner order updated successfully!");
      setDraggedIndex(null);
    } catch (error) {
      console.error("Error reordering banners:", error);
      toast.error("Failed to reorder banners. Please try again.");
      loadBanners();
    }
  };

  // Filter banners based on hero display mode AND user filter
  const filteredBanners = banners.filter((banner) => {
    // First apply hero display mode filter based on banner type
    let heroModeMatch = false;

    if (heroDisplayMode === "image" || heroDisplayMode === "carousel") {
      // Image mode: show primary banners with type "image"
      heroModeMatch = banner.type === "image";
    } else if (heroDisplayMode === "video") {
      // Video mode: show primary banners with type "video"
      heroModeMatch = banner.type === "video";
    }

    // Then apply user's manual filter
    const userFilterMatch = bannerFilter === "all" ? true : banner.active;

    return heroModeMatch && userFilterMatch;
  });

  const columns: ColumnDef<Banner>[] = [
    {
      accessorKey: "drag",
      cell: ({ row }) => (
        <div
          className="cursor-grab active:cursor-grabbing"
          draggable
          onDragStart={() => handleDragStart(row.index)}
          onDragOver={(e) => handleDragOver(e, row.index)}
          onDragEnd={handleDragEnd}
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
      ),
      header: "",
      size: 40,
    },
    {
      accessorKey: "imageUrl",
      cell: ({ row }) => (
        <img
          src={row.original.imageUrl}
          alt={row.original.title}
          className="h-12 w-20 rounded object-cover"
        />
      ),
      header: "Image",
      size: 100,
    },
    {
      accessorKey: "title",
      cell: ({ row }) => <p className="font-medium">{row.original.title}</p>,
      header: "Title",
    },
    {
      accessorKey: "type",
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium capitalize text-secondary-foreground">
          {row.original.type}
        </span>
      ),
      header: "Type",
      size: 80,
    },
    {
      accessorKey: "status",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1.5">
          <StatusBadge status={row.original.active ? "active" : "inactive"} />
          {row.original.isPrimary && <StatusBadge isPrimary />}
        </div>
      ),
      header: "Status",
      size: 150,
    },
    {
      accessorKey: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleToggleActive(row.original)}>
              <StatusBadge
                className="mr-2"
                status={row.original.active ? "inactive" : "active"}
              />
              {row.original.active ? "Deactivate" : "Activate"}
            </DropdownMenuItem>
            {!row.original.isPrimary && (
              <DropdownMenuItem onClick={() => handleSetPrimary(row.original)}>
                <Star className="mr-2 h-4 w-4" />
                Set as Primary
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => handleDelete(row.original)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      header: "",
      size: 60,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banners</h1>
          <p className="text-muted-foreground">
            Manage hero section banners for your website
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Banner
        </Button>
      </div>

      <HeroSettingsCard onSettingsChange={loadHeroSettings} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>All Banners</CardTitle>
              <CardDescription>
                {heroDisplayMode === "image" || heroDisplayMode === "video"
                  ? "Only the primary banner will be displayed in Image/Video mode."
                  : "All active banners will rotate in Carousel mode. Drag and drop to reorder."}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={bannerFilter}
                onValueChange={(value) =>
                  setBannerFilter(value as BannerFilter)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter banners" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Banners</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Loading banners...
                </p>
              </div>
            </div>
          ) : banners.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">No banners found</p>
                <Button className="mt-4" onClick={handleCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create your first banner
                </Button>
              </div>
            </div>
          ) : (
            <DataTable columns={columns} data={filteredBanners} />
          )}
        </CardContent>
      </Card>

      <BannerFormModal
        banner={selectedBanner}
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        onSuccess={loadBanners}
      />

      <DeleteBannerDialog
        banner={selectedBanner}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={loadBanners}
      />
    </div>
  );
}
