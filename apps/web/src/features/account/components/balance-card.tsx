import NumberFlow from "@number-flow/react";
import { Button } from "@workspace/ui/components/button";
import { Spinner } from "@workspace/ui/components/spinner";
import { EyeIcon, EyeOffIcon, OctagonXIcon, RefreshCwIcon } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";

import { useBalance } from "../hooks/use-balance";

const balanceVisibilityStorageKey = "smart-pump:balance-visible";

const readBalanceVisibilityPreference = () => {
  if (typeof window === "undefined") {
    return true;
  }

  return window.localStorage.getItem(balanceVisibilityStorageKey) !== "false";
};

const parseCurrencyBalance = (value?: string) =>
  Number(value?.replaceAll(/[$,]/gu, "") ?? 0);

const MIN_BALANCE_FONT_SIZE = 48;
const MAX_BALANCE_FONT_SIZE = 126;
const MOBILE_BALANCE_VIEWPORT_RATIO = 0.16;
const DESKTOP_BALANCE_VIEWPORT_RATIO = 0.11;
const BALANCE_TEXT_SAFETY_RATIO = 0.92;

const getPreferredBalanceFontSize = () => {
  const viewportRatio =
    window.innerWidth < 640
      ? MOBILE_BALANCE_VIEWPORT_RATIO
      : DESKTOP_BALANCE_VIEWPORT_RATIO;

  return Math.min(
    MAX_BALANCE_FONT_SIZE,
    Math.max(MIN_BALANCE_FONT_SIZE, window.innerWidth * viewportRatio)
  );
};

interface BalanceAmountProps {
  value: number;
  measuredSize: number | null;
  onMeasured: (size: number) => void;
}

const BalanceAmount = ({
  value,
  measuredSize,
  onMeasured,
}: BalanceAmountProps) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [fontSize, setFontSize] = useState(
    measuredSize ?? MIN_BALANCE_FONT_SIZE
  );
  const hasReported = useRef(false);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container || measuredSize !== null) {
      return;
    }

    const measure = () => {
      const preferredSize = getPreferredBalanceFontSize();
      const availableWidth = container.clientWidth * BALANCE_TEXT_SAFETY_RATIO;
      const measuredWidth = container.scrollWidth;

      const newSize =
        measuredWidth <= availableWidth
          ? preferredSize
          : Math.max(
              MIN_BALANCE_FONT_SIZE,
              Math.round(preferredSize * (availableWidth / measuredWidth))
            );

      setFontSize(newSize);

      if (!hasReported.current) {
        hasReported.current = true;
        onMeasured(newSize);
      }
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(container);

    return () => observer.disconnect();
  }, [measuredSize, onMeasured]);

  return (
    <p
      ref={containerRef}
      aria-label={Number.isFinite(value) ? undefined : "Hidden balance"}
      className="max-w-full overflow-hidden font-heading font-extrabold leading-none tracking-normal"
      style={{ fontSize }}
    >
      <NumberFlow
        className="block max-w-full tabular-nums"
        format={{
          currency: "USD",
          minimumFractionDigits: 2,
          style: "currency",
        }}
        locales="en-US"
        value={Number.isFinite(value) ? value : 0}
      />
    </p>
  );
};

export const BalanceCard = () => {
  const balance = useBalance();
  const [isBalanceVisible, setIsBalanceVisible] = useState(
    readBalanceVisibilityPreference
  );
  const measuredSizeRef = useRef<number | null>(null);

  const handleToggle = () => {
    setIsBalanceVisible((current) => {
      const next = !current;
      window.localStorage.setItem(balanceVisibilityStorageKey, String(next));
      return next;
    });
  };

  const handleMeasured = (size: number) => {
    measuredSizeRef.current = size;
  };

  const numericValue = balance.data
    ? parseCurrencyBalance(balance.data.balance)
    : 0;

  return (
    <section className="rounded-[2.5rem] bg-card p-8 shadow-[rgba(0,0,0,0.04)_0px_1px_1px_0px,rgba(0,0,0,0.04)_0px_2px_4px_0px] sm:p-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-heading font-extrabold text-2xl">Balance</h2>
          <p className="mt-1 text-muted-foreground text-sm">
            Available account balance
          </p>
        </div>
        <div className="flex items-center gap-2">
          {balance.isError && (
            <Button
              aria-label="Retry balance"
              disabled={balance.isFetching}
              onClick={() => balance.refetch()}
              size="icon"
              variant="outline"
            >
              {balance.isFetching ? (
                <Spinner />
              ) : (
                <RefreshCwIcon aria-hidden="true" />
              )}
            </Button>
          )}
          <Button
            aria-label={isBalanceVisible ? "Hide balance" : "Show balance"}
            onClick={handleToggle}
            size="icon"
            variant="outline"
          >
            {isBalanceVisible ? (
              <EyeOffIcon aria-hidden="true" />
            ) : (
              <EyeIcon aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>
      <div className="mt-10 min-h-24">
        {balance.isError && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <OctagonXIcon aria-hidden="true" className="size-4" />
            <span>Unable to load balance.</span>
          </div>
        )}
        {!balance.isError && (
          <div className="relative">
            {/* Always mounted — CSS toggles visibility */}
            <div
              className={`transition-opacity duration-200 ${
                isBalanceVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <BalanceAmount
                measuredSize={measuredSizeRef.current}
                onMeasured={handleMeasured}
                value={numericValue}
              />
            </div>
            {/* Overlay for hidden state */}
            {!isBalanceVisible && (
              <p className="absolute inset-0 max-w-full overflow-hidden font-heading font-extrabold text-[clamp(3.25rem,16vw,7.875rem)] leading-none tracking-normal">
                ••••••
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
