import type { LoginCredentials } from "@repo/types/auth";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";

/**
 * Login mutation hook
 * Authenticates user and syncs with Zustand store.
 * Tokens are set as HttpOnly cookies by the server — not handled here.
 */
export function useLogin() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (response) => {
      // Sync user with Zustand store (tokens are HttpOnly cookies — invisible to JS)
      login(response.admin);
      toast.success("Login successful");
      navigate("/");
    },
  });
}

/**
 * Logout mutation hook
 * Calls server to clear HttpOnly cookies, then clears local state and cache.
 */
export function useLogout() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear Zustand store
      logout();
      // Clear all React Query cache
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate("/login");
    },
  });
}
