import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/toast";

import { ApiError } from "../../../lib/api";
import { updateMe } from "../lib/account.api";
import { balanceQueryKey } from "./use-balance";
import { meQueryKey } from "./use-me";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : "Unable to update profile";
      toast.error({ description: message, title: "Update failed" });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: meQueryKey }),
        queryClient.invalidateQueries({ queryKey: balanceQueryKey }),
      ]);
      toast.success({ title: "Profile updated" });
    },
  });
};
