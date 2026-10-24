export function MemberListSkeleton() {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="h-11 w-40 animate-pulse rounded-full bg-white/80"
        />
      ))}
    </div>
  );
}

export function MemberSummarySkeleton() {
  return (
    <div className="grid animate-pulse items-start gap-4 xl:grid-cols-[minmax(320px,380px)_minmax(0,1fr)] xl:gap-6">
      <div className="h-56 rounded-3xl bg-white xl:col-start-1 sm:h-64" />
      <div className="grid grid-cols-2 gap-3 xl:col-start-1">
        <div className="h-24 rounded-[20px] bg-white sm:h-28" />
        <div className="h-24 rounded-[20px] bg-white sm:h-28" />
        <div className="h-24 rounded-[20px] bg-white sm:h-28" />
        <div className="h-24 rounded-[20px] bg-white sm:h-28" />
      </div>
      <div className="space-y-4 xl:col-start-2 xl:row-start-1 xl:row-span-3">
        <div className="h-64 rounded-3xl bg-white sm:h-80" />
        <div className="h-72 rounded-3xl bg-white sm:h-96" />
      </div>
      <div className="h-40 rounded-3xl bg-white xl:col-start-1 sm:h-56" />
    </div>
  );
}
