export type Expense = {
  _id: string;
  amount: number; // Frontend receives as number (API converts from Decimal128)
  category: ExpenseCategory;
  date: Date;
  description?: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
};

// Enum pattern (matches existing pattern in booking.ts)
export const ExpenseCategory = {
  SUPPLIES: 'supplies',
  MATERIALS: 'materials',
  UTILITIES: 'utilities',
  OTHER: 'other',
} as const;
export type ExpenseCategory =
  (typeof ExpenseCategory)[keyof typeof ExpenseCategory];

// Query params type
export type ExpenseQueryParams = {
  startDate?: string; // ISO 8601
  endDate?: string;
  category?: ExpenseCategory;
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'amount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
};

// API response type
export type ExpenseResponse = {
  data: Expense[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
