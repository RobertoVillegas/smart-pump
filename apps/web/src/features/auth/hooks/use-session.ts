import { useQuery } from "@tanstack/react-query";

import { getSession } from "../lib/auth.api";

export const sessionQueryKey = ["session"] as const;

export const useSession = () =>
  useQuery({
    queryFn: getSession,
    queryKey: sessionQueryKey,
  });
