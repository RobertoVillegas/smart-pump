import { useQuery } from "@tanstack/react-query";

import { getMe } from "../lib/account.api";

export const meQueryKey = ["me"] as const;

export const useMe = (enabled = true) =>
  useQuery({
    enabled,
    queryFn: getMe,
    queryKey: meQueryKey,
  });
