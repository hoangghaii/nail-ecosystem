/**
 * Expense Service
 *
 * Handles CRUD operations for expenses
 */

import type { Expense, ExpenseQueryParams, ExpenseResponse } from '@repo/types/expense';

import { apiClient } from '@/lib/apiClient';

export class ExpenseService {
  async getAll(params?: ExpenseQueryParams): Promise<ExpenseResponse> {
    const queryString = this.buildQueryString(params);
    return apiClient.get<ExpenseResponse>(`/expenses${queryString}`);
  }

  async getById(id: string): Promise<Expense | null> {
    try {
      return await apiClient.get<Expense>(`/expenses/${id}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.statusCode === 404) return null;
      throw error;
    }
  }

  async create(data: Omit<Expense, '_id' | 'createdAt' | 'updatedAt' | 'currency'>): Promise<Expense> {
    return apiClient.post<Expense>('/expenses', data);
  }

  async update(id: string, data: Partial<Omit<Expense, '_id' | 'createdAt' | 'updatedAt'>>): Promise<Expense> {
    return apiClient.patch<Expense>(`/expenses/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/expenses/${id}`);
  }

  /**
   * Builds query string from params
   * @private
   */
  private buildQueryString(params?: ExpenseQueryParams): string {
    if (!params) return '';

    const searchParams = new URLSearchParams();

    if (params.startDate) searchParams.append('startDate', params.startDate);
    if (params.endDate) searchParams.append('endDate', params.endDate);
    if (params.category) searchParams.append('category', params.category);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    const query = searchParams.toString();
    return query ? `?${query}` : '';
  }
}

export const expenseService = new ExpenseService();
