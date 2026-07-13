import type { OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<OrderStatus, string> = {
  pending: "bg-outline-variant/40 text-on-surface-variant",
  processing: "bg-primary-container/30 text-primary",
  shipped: "bg-secondary-container/40 text-secondary",
  delivered: "bg-m-pesa-green/10 text-m-pesa-green",
  cancelled: "bg-error-container text-error",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-body-sm font-semibold capitalize", STATUS_STYLE[status])}>
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full bg-current",
          status === "processing" && "animate-pulse",
        )}
      />
      {status}
    </span>
  );
}
