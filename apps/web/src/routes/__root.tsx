import { QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { Toaster } from "@workspace/ui/components/toast";
import type { ReactNode } from "react";

import { queryClient } from "../lib/query-client";

import appCss from "@workspace/ui/globals.css?url";

const RootComponent = () => (
  <QueryClientProvider client={queryClient}>
    <Outlet />
    <Toaster />
  </QueryClientProvider>
);

const RootDocument = ({ children }: { children: ReactNode }) => (
  <html lang="en">
    <head>
      <HeadContent />
    </head>
    <body>
      {children}
      <Scripts />
    </body>
  </html>
);

export const Route = createRootRoute({
  component: RootComponent,
  head: () => ({
    links: [
      {
        href: appCss,
        rel: "stylesheet",
      },
    ],
    meta: [
      {
        charSet: "utf-8",
      },
      {
        content:
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
        name: "viewport",
      },
      {
        title: "SMART Pump",
      },
    ],
  }),
  notFoundComponent: () => (
    <main className="container mx-auto p-4 pt-16">
      <h1>404</h1>
      <p>The requested page could not be found.</p>
    </main>
  ),
  shellComponent: RootDocument,
});
