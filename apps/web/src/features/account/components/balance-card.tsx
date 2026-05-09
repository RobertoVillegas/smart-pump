import { Button } from "@workspace/ui/components/button";
import { Spinner } from "@workspace/ui/components/spinner";
import { Eye, OctagonXIcon } from "lucide-react";

import { useBalance } from "../hooks/use-balance";

const renderBalance = (balance: ReturnType<typeof useBalance>) => {
  if (balance.isError) {
    return (
      <div className="flex items-center gap-2 text-destructive text-sm">
        <OctagonXIcon aria-hidden="true" className="size-4" />
        <span>Unable to load balance.</span>
      </div>
    );
  }

  if (balance.data) {
    return (
      <p className="font-heading font-semibold text-3xl">
        {balance.data.balance}
      </p>
    );
  }

  return (
    <p className="text-muted-foreground text-sm">
      Balance is hidden until requested.
    </p>
  );
};

export const BalanceCard = () => {
  const balance = useBalance();

  return (
    <section className="rounded-lg border bg-card p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-semibold text-lg">Balance</h2>
          <p className="text-muted-foreground text-sm">
            Available account balance
          </p>
        </div>
        <Button
          aria-label="Check balance"
          disabled={balance.isFetching}
          onClick={() => balance.refetch()}
          size="icon"
          variant="outline"
        >
          {balance.isFetching ? <Spinner /> : <Eye aria-hidden="true" />}
        </Button>
      </div>
      <div className="mt-5 min-h-12">{renderBalance(balance)}</div>
    </section>
  );
};
