"use client";

import { Toast } from "@base-ui/react/toast";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";

import { cn } from "../lib/utils";

const toastManager = Toast.createToastManager();

type ToastType = "success" | "error" | "info" | "warning" | "loading";

type AddOptions = Parameters<typeof toastManager.add>[0];

type SimpleArg =
  | string
  | (Omit<AddOptions, "type"> & { description?: AddOptions["description"] });

const normalize = (arg: SimpleArg, type?: ToastType): AddOptions => {
  const base = typeof arg === "string" ? { title: arg } : arg;
  return type ? { ...base, type } : base;
};

export const toast = Object.assign(
  (arg: SimpleArg) => toastManager.add(normalize(arg)),
  {
    dismiss: (id?: string) => toastManager.close(id),
    error: (arg: SimpleArg) => toastManager.add(normalize(arg, "error")),
    info: (arg: SimpleArg) => toastManager.add(normalize(arg, "info")),
    loading: (arg: SimpleArg) => toastManager.add(normalize(arg, "loading")),
    promise: toastManager.promise.bind(toastManager),
    success: (arg: SimpleArg) => toastManager.add(normalize(arg, "success")),
    warning: (arg: SimpleArg) => toastManager.add(normalize(arg, "warning")),
  }
);

const ICONS: Record<ToastType, React.ReactNode> = {
  error: <OctagonXIcon className="size-4 text-destructive" />,
  info: <InfoIcon className="size-4 text-sky-500" />,
  loading: (
    <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
  ),
  success: <CircleCheckIcon className="size-4 text-emerald-500" />,
  warning: <TriangleAlertIcon className="size-4 text-amber-500" />,
};

const ToastList = () => {
  const { toasts } = Toast.useToastManager();

  return toasts.map((t) => {
    const icon = t.type ? ICONS[t.type as ToastType] : null;

    return (
      <Toast.Root
        className={cn(
          "absolute top-0 right-0 left-auto z-[calc(1000-var(--toast-index))] mr-0 w-full origin-top",
          "rounded-[var(--radius)] border border-border bg-popover p-4 text-popover-foreground shadow-lg select-none",
          "[--gap:0.75rem] [--peek:0.75rem]",
          "[--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]",
          "[--height:var(--toast-frontmost-height,var(--toast-height))]",
          "[--offset-y:calc(var(--toast-offset-y)+(var(--toast-index)*var(--gap))+var(--toast-swipe-movement-y))]",
          "h-[var(--height)] data-[expanded]:h-[var(--toast-height)]",
          "[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+(var(--toast-index)*var(--peek))+(var(--shrink)*var(--height))))_scale(var(--scale))]",
          "data-[expanded]:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
          "data-[starting-style]:[transform:translateY(-150%)]",
          "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(-150%)]",
          "data-[ending-style]:opacity-0 data-[limited]:opacity-0",
          "[transition:transform_0.5s_cubic-bezier(0.22,1,0.36,1),opacity_0.5s,height_0.15s]",
          "after:absolute after:right-0 after:bottom-full after:left-0 after:h-[calc(var(--gap)+1px)] after:content-['']"
        )}
        key={t.id}
        toast={t}
      >
        <Toast.Content className="overflow-hidden transition-opacity duration-250 data-[behind]:pointer-events-none data-[behind]:opacity-0 data-[expanded]:opacity-100">
          <div className="flex items-start gap-3 pr-5">
            {icon ? <div className="mt-0.5 shrink-0">{icon}</div> : null}
            <div className="min-w-0 flex-1">
              <Toast.Title className="font-semibold text-sm leading-5" />
              <Toast.Description className="text-muted-foreground text-sm leading-5" />
            </div>
          </div>
          <Toast.Close
            aria-label="Close"
            className="absolute top-2 right-2 inline-flex size-5 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <XIcon className="size-3.5" />
          </Toast.Close>
        </Toast.Content>
      </Toast.Root>
    );
  });
};

export const Toaster = () => (
  <Toast.Provider toastManager={toastManager}>
    <Toast.Portal>
      <Toast.Viewport className="fixed top-4 left-1/2 z-50 flex w-[min(360px,calc(100vw-2rem))] -translate-x-1/2 outline-0 sm:right-4 sm:left-auto sm:translate-x-0">
        <ToastList />
      </Toast.Viewport>
    </Toast.Portal>
  </Toast.Provider>
);
