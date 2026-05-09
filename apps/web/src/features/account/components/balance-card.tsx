import { Button } from "@workspace/ui/components/button";
import { Eye } from "lucide-react";

import { useBalance } from "../hooks/use-balance";

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
          <Eye aria-hidden="true" />
        </Button>
      </div>
      <div className="mt-5 min-h-12">
        {balance.data ? (
          <p className="font-heading font-semibold text-3xl">
            {balance.data.balance}
          </p>
        ) : (
          <p className="text-muted-foreground text-sm">
            Balance is hidden until requested.
          </p>
        )}
      </div>
    </section>
  );
};
