/**
 * React Query hooks for nail shapes and nail styles
 */

import type {
  CreateNailOptionDto,
  NailShapeItem,
  NailStyleItem,
  UpdateNailOptionDto,
} from "@repo/types/nail-options";

import { queryKeys } from "@repo/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { nailShapesService, nailStylesService } from "@/services/nailOptions.service";
import { useAuthStore } from "@/store/authStore";

// ── Nail Shapes ────────────────────────────────────────────────────────────

export function useNailShapes() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    enabled: isAuthenticated,
    queryFn: () => nailShapesService.getAll(),
    queryKey: queryKeys.nailShapes.lists(),
    staleTime: 60_000,
  });
}

export function useCreateNailShape() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNailOptionDto) => nailShapesService.create(data),
    onError: () => toast.error("Failed to create nail shape"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nailShapes.all });
      toast.success("Nail shape created");
    },
  });
}

export function useUpdateNailShape() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, id }: { data: UpdateNailOptionDto; id: string }) =>
      nailShapesService.update(id, data),
    onError: () => toast.error("Failed to update nail shape"),
    onSuccess: (updated: NailShapeItem) => {
      queryClient.setQueryData<{ data: NailShapeItem[] }>(
        queryKeys.nailShapes.lists(),
        (old) => old ? { ...old, data: old.data.map((s) => s._id === updated._id ? updated : s) } : old,
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.nailShapes.all });
      toast.success("Nail shape updated");
    },
  });
}

export function useDeleteNailShape() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => nailShapesService.delete(id),
    onError: () => toast.error("Failed to delete nail shape"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nailShapes.all });
      toast.success("Nail shape deleted");
    },
  });
}

// ── Nail Styles ────────────────────────────────────────────────────────────

export function useNailStyles() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    enabled: isAuthenticated,
    queryFn: () => nailStylesService.getAll(),
    queryKey: queryKeys.nailStyles.lists(),
    staleTime: 60_000,
  });
}

export function useCreateNailStyle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNailOptionDto) => nailStylesService.create(data),
    onError: () => toast.error("Failed to create nail style"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nailStyles.all });
      toast.success("Nail style created");
    },
  });
}

export function useUpdateNailStyle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, id }: { data: UpdateNailOptionDto; id: string }) =>
      nailStylesService.update(id, data),
    onError: () => toast.error("Failed to update nail style"),
    onSuccess: (updated: NailStyleItem) => {
      queryClient.setQueryData<{ data: NailStyleItem[] }>(
        queryKeys.nailStyles.lists(),
        (old) => old ? { ...old, data: old.data.map((s) => s._id === updated._id ? updated : s) } : old,
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.nailStyles.all });
      toast.success("Nail style updated");
    },
  });
}

export function useDeleteNailStyle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => nailStylesService.delete(id),
    onError: () => toast.error("Failed to delete nail style"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nailStyles.all });
      toast.success("Nail style deleted");
    },
  });
}
