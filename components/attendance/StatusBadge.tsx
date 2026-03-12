type Status = "pending" | "checked_in" | "checked_out" | "error" | "swapped";

type StatusBadgeProps = {
  label: string;
  value: string;
  status?: Status;
};

const statusColorMap: Record<Status, string> = {
  pending: "text-kmitl",
  checked_in: "text-green-600",
  checked_out: "text-gray-500",
  error: "text-red-500",
  swapped: "text-blue-500",
};

export function StatusBadge({ label, value, status }: StatusBadgeProps) {
  const statusColor = status ? statusColorMap[status] : "text-gray-900";

  return (
    <div
      className="
        rounded-xl 
        bg-neutral-200 
        py-3 
        text-center
        border 
        border-neutral-100
      "
    >
      <p className="text-xs text-neutral-500">{label}</p>
      <p className={`font-semibold ${statusColor}`}>{value}</p>
    </div>
  );
}
