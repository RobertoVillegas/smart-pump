import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateMe } from "../lib/account.api";
import { balanceQueryKey } from "./use-balance";
import { meQueryKey } from "./use-me";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: meQueryKey }),
        queryClient.invalidateQueries({ queryKey: balanceQueryKey }),
      ]);
    },
  });
};
