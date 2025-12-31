import { toast as sonnerToast } from "sonner";

/**
 * Toast utility wrapper around sonner
 * Provides consistent toast notifications throughout the app
 */
export const toast = {
  /**
   * Dismiss a specific toast by ID
   */
  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId);
  },

  /**
   * Show an error toast notification
   */
  error: (message: string, description?: string) => {
    sonnerToast.error(message, {
      description,
    });
  },

  /**
   * Show an info/default toast notification
   */
  info: (message: string, description?: string) => {
    sonnerToast(message, {
      description,
    });
  },

  /**
   * Show a loading toast notification
   * Returns a toast ID that can be used to update or dismiss the toast
   */
  loading: (message: string, description?: string) => {
    return sonnerToast.loading(message, {
      description,
    });
  },

  /**
   * Show a success toast notification
   */
  success: (message: string, description?: string) => {
    sonnerToast.success(message, {
      description,
    });
  },

  /**
   * Show a warning toast notification
   */
  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, {
      description,
    });
  },
};
