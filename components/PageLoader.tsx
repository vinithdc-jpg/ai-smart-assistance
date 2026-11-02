import { BrainCircuit } from "lucide-react";

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
        <div className="ai-loader" aria-hidden="true">
          <div className="ai-loader__orbit ai-loader__orbit--outer">
            <span className="ai-loader__satellite ai-loader__satellite--blue" />
          </div>
          <div className="ai-loader__orbit ai-loader__orbit--inner">
            <span className="ai-loader__satellite ai-loader__satellite--cyan" />
          </div>
          <div className="ai-loader__core">
            <BrainCircuit className="h-8 w-8" strokeWidth={1.7} />
          </div>
        </div>
        <p className="text-sm font-medium text-slate-500">{label}...</p>
      </div>
    </div>
  );
}
