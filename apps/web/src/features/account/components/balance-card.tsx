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

const BalanceAmount = ({ value }: { value: number }) => (
  <p className="font-heading font-semibold text-3xl">
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
    return <p className="font-heading font-semibold text-3xl">••••••</p>;
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
    <section className="rounded-lg border bg-card p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-semibold text-lg">Balance</h2>
          <p className="text-muted-foreground text-sm">
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
      <div className="mt-5 min-h-12">
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
