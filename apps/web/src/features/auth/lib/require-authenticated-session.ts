import { redirect } from "@tanstack/react-router";

import { queryClient } from "../../../lib/query-client";
import { sessionQueryKey } from "../hooks/use-session";
import { getSession } from "./auth.api";

export const requireAuthenticatedSession = async () => {
  const session = await queryClient.ensureQueryData({
    queryFn: getSession,
    queryKey: sessionQueryKey,
  });

  if (!session.authenticated) {
    throw redirect({ to: "/login" });
  }
};

export const redirectAuthenticatedSession = async () => {
  const session = await queryClient.ensureQueryData({
    queryFn: getSession,
    queryKey: sessionQueryKey,
  });

  if (session.authenticated) {
    throw redirect({ to: "/app" });
  }
};
