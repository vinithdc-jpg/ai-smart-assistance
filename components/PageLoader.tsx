interface PageLoaderProps {
  label?: string;
  overlay?: boolean;
}

export default function PageLoader({
  label = "Loading page",
  overlay = false,
}: PageLoaderProps) {
  return (
    <div
      className={
        overlay
          ? "fixed inset-0 z-100 grid place-items-center bg-white/70 backdrop-blur-sm"
          : "grid min-h-screen place-items-center bg-white"
      }
      role="status"
      aria-label={label}
    >
      <div className="flex flex-col items-center gap-3">
        {/* Spinner */}
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-[3px] border-blue-100" />

          <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-blue-600" />
        </div>

        {/* Loading text */}
        <p className="text-sm font-medium text-slate-500">{label}...</p>
      </div>
    </div>
  );
}
