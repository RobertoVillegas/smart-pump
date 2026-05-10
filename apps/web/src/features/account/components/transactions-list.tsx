import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  GaugeIcon,
  ShieldCheckIcon,
  WrenchIcon,
} from "lucide-react";

const transactions = [
  {
    amount: "-$184.20",
    description: "Scheduled pump maintenance",
    icon: WrenchIcon,
    tone: "debit",
  },
  {
    amount: "+$320.00",
    description: "Service credit",
    icon: ArrowDownLeftIcon,
    tone: "credit",
  },
  {
    amount: "-$42.75",
    description: "Sensor calibration",
    icon: GaugeIcon,
    tone: "debit",
  },
  {
    amount: "-$96.40",
    description: "Replacement valve kit",
    icon: ArrowUpRightIcon,
    tone: "debit",
  },
  {
    amount: "$0.00",
    description: "Account safety review",
    icon: ShieldCheckIcon,
    tone: "neutral",
  },
] as const;

export const TransactionsList = () => (
  <section className="rounded-[2.5rem] bg-card p-8 shadow-[rgba(0,0,0,0.04)_0px_1px_1px_0px,rgba(0,0,0,0.04)_0px_2px_4px_0px] sm:p-10">
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="font-heading font-extrabold text-3xl tracking-normal">
          Recent activity
        </h2>
        <p className="mt-2 text-muted-foreground">
          Latest account events and service charges.
        </p>
      </div>
      <span className="inline-flex h-8 items-center justify-center rounded-full bg-primary/10 px-3 font-semibold text-primary text-sm leading-none">
        Demo data
      </span>
    </div>
    <div className="mt-8 divide-y divide-border">
      {transactions.map((transaction) => {
        const Icon = transaction.icon;
        const isCredit = transaction.tone === "credit";

        return (
          <div
            className="grid grid-cols-[auto_1fr_auto] items-center gap-4 py-4 first:pt-0 last:pb-0"
            key={transaction.description}
          >
            <div className="grid size-11 place-items-center rounded-full bg-secondary text-foreground">
              <Icon aria-hidden="true" className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold">
                {transaction.description}
              </p>
              <p className="text-muted-foreground text-sm">SMART Pump</p>
            </div>
            <p
              className={
                isCredit
                  ? "font-extrabold text-[#22c55e]"
                  : "font-extrabold text-foreground"
              }
            >
              {transaction.amount}
            </p>
          </div>
        );
      })}
    </div>
  </section>
);
