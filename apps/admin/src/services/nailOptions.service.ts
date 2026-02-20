/**
 * Nail Options Service (Admin)
 *
 * CRUD operations for nail shapes and nail styles
 */

import type {
  CreateNailOptionDto,
  NailShapeItem,
  NailStyleItem,
  UpdateNailOptionDto,
} from "@repo/types/nail-options";

import { apiClient } from "@/lib/apiClient";

class NailShapesService {
  async getAll(): Promise<{ data: NailShapeItem[] }> {
    return apiClient.get<{ data: NailShapeItem[] }>("/nail-shapes");
  }

  async create(data: CreateNailOptionDto): Promise<NailShapeItem> {
    return apiClient.post<NailShapeItem>("/nail-shapes", data);
  }

  async update(id: string, data: UpdateNailOptionDto): Promise<NailShapeItem> {
    return apiClient.patch<NailShapeItem>(`/nail-shapes/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/nail-shapes/${id}`);
  }
}

class NailStylesService {
  async getAll(): Promise<{ data: NailStyleItem[] }> {
    return apiClient.get<{ data: NailStyleItem[] }>("/nail-styles");
  }

  async create(data: CreateNailOptionDto): Promise<NailStyleItem> {
    return apiClient.post<NailStyleItem>("/nail-styles", data);
  }

  async update(id: string, data: UpdateNailOptionDto): Promise<NailStyleItem> {
    return apiClient.patch<NailStyleItem>(`/nail-styles/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/nail-styles/${id}`);
  }
}

export const nailShapesService = new NailShapesService();
export const nailStylesService = new NailStylesService();
