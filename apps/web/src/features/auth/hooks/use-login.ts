import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "@workspace/ui/components/toast";

import { login } from "../lib/auth.api";
import { sessionQueryKey } from "./use-session";

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
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
