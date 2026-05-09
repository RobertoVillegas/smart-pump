import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "@workspace/ui/components/toast";

import { logout } from "../lib/auth.api";
import { sessionQueryKey } from "./use-session";

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSettled: async () => {
      queryClient.removeQueries();
      await queryClient.invalidateQueries({ queryKey: sessionQueryKey });
      await navigate({ to: "/login" });
      toast.success({ title: "Signed out" });
    },
  });
};
