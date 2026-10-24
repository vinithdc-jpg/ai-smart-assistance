interface TransactionRowProps {
  id: string;
  createdDate: string;
  member: string;
  type: string;
  staff: string;
  amount: string;
  status: string;
  onView: () => void;
}

export default function TransactionRow({
  id,
  createdDate,
  member,
  type,
  staff,
  amount,
  status,
  onView,
}: TransactionRowProps) {
  return (
    <div className="grid grid-cols-[1.2fr_1.3fr_1fr_1.2fr_1fr_.8fr_auto] items-center gap-2 px-4 py-4 text-xs">
      <div>
        <button
          type="button"
          onClick={onView}
          className="text-left font-semibold text-primary hover:underline"
          aria-label={`View transaction ${id}`}
        >
          {id}
        </button>

        <p className="mt-1 text-[10px] text-slate-400">
          {formatCreatedDateTime(createdDate)}
        </p>
      </div>

      <div>
        <p className="font-semibold text-slate-700">{member}</p>

        <p className="mt-1 text-[10px] text-slate-400">Member</p>
      </div>

      <div className="text-slate-600">{type}</div>

      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-soft text-[9px] font-bold text-primary">
          {staff
            .split(" ")
            .map((x) => x[0])
            .join("")
            .slice(0, 2)}
        </div>

        <span className="truncate text-slate-600">{staff}</span>
      </div>

      <div className="font-bold text-slate-800">{amount}</div>

      <div>
        <span
          className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
            status === "Completed"
              ? "bg-emerald-50 text-emerald-600"
              : status === "Failed"
                ? "bg-red-50 text-red-600"
                : "bg-amber-50 text-amber-600"
          }`}
        >
          {status}
        </span>
      </div>

      <button
        type="button"
        onClick={onView}
        className="rounded-md px-2 py-1 font-semibold text-primary hover:bg-primary-soft"
        aria-label={`Open details for ${id}`}
      >
        Details
      </button>
    </div>
  );
}

function formatCreatedDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}
