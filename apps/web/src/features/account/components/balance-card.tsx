import NumberFlow from "@number-flow/react";
import { Button } from "@workspace/ui/components/button";
import { Spinner } from "@workspace/ui/components/spinner";
import { EyeIcon, EyeOffIcon, OctagonXIcon, RefreshCwIcon } from "lucide-react";
import { useState } from "react";

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

const formatCurrencyBalance = (value: number) =>
  new Intl.NumberFormat("en-US", {
    currency: "USD",
    minimumFractionDigits: 2,
    style: "currency",
  }).format(value);

const BalanceAmount = ({ value }: { value: number }) => (
  <p
    aria-label={formatCurrencyBalance(value)}
    className="font-heading font-extrabold text-[clamp(3.75rem,11vw,7.875rem)] leading-none tracking-normal"
  >
    <NumberFlow
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

const renderBalance = (
  balance: ReturnType<typeof useBalance>,
  isBalanceVisible: boolean
) => {
  if (balance.isError) {
    return null;
  }

  if (!isBalanceVisible) {
    return (
      <p className="font-heading font-extrabold text-[clamp(3.75rem,11vw,7.875rem)] leading-none tracking-normal">
        ••••••
      </p>
    );
  }

  if (balance.isLoading) {
    return <BalanceAmount value={0} />;
  }

  if (balance.data) {
    return <BalanceAmount value={parseCurrencyBalance(balance.data.balance)} />;
  }

  return <p className="text-muted-foreground text-sm">No balance available.</p>;
};

export const BalanceCard = () => {
  const balance = useBalance();
  const [isBalanceVisible, setIsBalanceVisible] = useState(
    readBalanceVisibilityPreference
  );

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible((currentValue) => {
      const nextValue = !currentValue;
      window.localStorage.setItem(
        balanceVisibilityStorageKey,
        String(nextValue)
      );
      return nextValue;
    });
  };

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
          {balance.isError ? (
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
          ) : null}
          <Button
            aria-label={isBalanceVisible ? "Hide balance" : "Show balance"}
            onClick={toggleBalanceVisibility}
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
        {balance.isError ? (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <OctagonXIcon aria-hidden="true" className="size-4" />
            <span>Unable to load balance.</span>
          </div>
        ) : (
          renderBalance(balance, isBalanceVisible)
        )}
      </div>
    </section>
  );
};
