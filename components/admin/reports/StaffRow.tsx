interface StaffRowProps {
  name: string;
  email: string;
  role: string;
  members: number;
  transactions: number;
  amount: string;
  status: string;
  color: string;
}

export default function StaffRow({
  name,
  email,
  role,
  members,
  transactions,
  amount,
  status,
  color,
}: StaffRowProps) {
  return (
    <div className="grid grid-cols-[2fr_1.5fr_.8fr_.8fr_1.2fr_.7fr] items-center px-4 py-4 text-xs">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-500">
          {name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)}
        </div>

        <div>
          <p className="font-semibold text-slate-700">
            {name}
          </p>

          <p className="mt-0.5 text-[10px] text-slate-400">
            {email}
          </p>
        </div>

      </div>

      <div className="text-slate-600">
        {role}
      </div>

      <div className="font-semibold text-slate-700">
        {members}
      </div>

      <div className="font-semibold text-slate-700">
        {transactions}
      </div>

      <div className="font-bold text-slate-800">
        {amount}
      </div>

      <div>
        <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${color}`}>
          {status}
        </span>
      </div>

    </div>
  );
}