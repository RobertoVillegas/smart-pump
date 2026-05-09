import { useQuery } from "@tanstack/react-query";

import { getBalance } from "../lib/account.api";

export const balanceQueryKey = ["balance"] as const;

export const useBalance = () =>
  useQuery({
    enabled: false,
    queryFn: getBalance,
    queryKey: balanceQueryKey,
  });
