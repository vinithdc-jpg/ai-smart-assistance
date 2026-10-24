interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

export default function StatCard2({
  title,
  value,
  description,
  icon,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {title}
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            {value}
          </h2>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
          {icon}
        </div>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
