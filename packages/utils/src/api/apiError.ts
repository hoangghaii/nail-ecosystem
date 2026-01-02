/**
 * API Error Class
 *
 * Standardized error handling for all API requests across admin and client apps.
 * Provides type-safe error parsing from HTTP responses.
 */

export class ApiError extends Error {
  statusCode: number;
  errors?: string[];

  constructor(message: string, statusCode: number, errors?: string[]) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }

  /**
   * Create ApiError from fetch Response
   */
  static async fromResponse(response: Response): Promise<ApiError> {
    let body: any;
    try {
      body = await response.json();
    } catch {
      body = { message: response.statusText };
    }

    const message = Array.isArray(body.message)
      ? body.message[0]
      : body.message || "Request failed";

    const errors = Array.isArray(body.message) ? body.message : undefined;

    return new ApiError(message, response.status, errors);
  }

  /**
   * Type guard for ApiError instances
   */
  static isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
  }

  /**
   * Get user-friendly error message based on status code
   */
  getUserMessage(): string {
    // Use specific error message if available
    if (this.message && this.message !== "Request failed") {
      return this.message;
    }

    // Fallback to status code mapping
    switch (this.statusCode) {
      case 400:
        return "Invalid request. Please check your input.";
      case 401:
        return "You are not authorized. Please log in.";
      case 403:
        return "You don't have permission to perform this action.";
      case 404:
        return "The requested resource was not found.";
      case 409:
        return "A conflict occurred. The resource may already exist.";
      case 422:
        return "Validation failed. Please check your input.";
      case 429:
        return "Too many requests. Please try again later.";
      case 500:
        return "Server error. Please try again later.";
      case 503:
        return "Service temporarily unavailable. Please try again later.";
      default:
        return "An error occurred. Please try again.";
    }
  }
}
