import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "@workspace/ui/components/toast";

import { ApiError } from "../../../lib/api";
import { login } from "../lib/auth.api";
import { sessionQueryKey } from "./use-session";

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : "Unable to sign in";
      toast.error({ description: message, title: "Sign in failed" });
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: sessionQueryKey });
      toast.success({
        description: `Signed in as ${data.user.firstName} ${data.user.lastName}`,
        title: "Welcome back",
      });
      await navigate({ to: "/app" });
    },
  });
};
