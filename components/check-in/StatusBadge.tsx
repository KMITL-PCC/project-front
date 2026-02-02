type Status = "pending" | "success" | "error";

type StatusBadgeProps = {
    label: string;
    value: string;
    status?: Status;
  };


const statusColorMap: Record<Status, string> = {
    pending: "text-orange-500",
    success: "text-green-600",
    error: "text-red-500",
};

export function StatusBadge({ label, value, status, }: StatusBadgeProps) {
    const statusColor =
    status === "pending"
      ? "text-orange-500"
      : status === "success"
      ? "text-green-600"
      : status === "error"
      ? "text-red-500"
      : "text-gray-900";

    return (
        <div className="rounded-xl bg-neutral-100 py-3 text-center">
            <p className="text-xs text-neutral-500">
                {label}
            </p>
            <p className={`font-semibold ${statusColor}`}>
                {value}
            </p>
        </div>
    )
}