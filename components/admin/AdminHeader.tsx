import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

export function AdminHeader({
  mobileMenuOpen,
  onMobileMenuToggle,
}: {
  mobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}) {
  return (
    <header className="z-30 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-4 sm:px-6 dark:bg-slate-950">
      <div className="flex items-center gap-4 w-full">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="admin-mobile-navigation"
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-accent lg:hidden"
        >
          {mobileMenuOpen ? (
            <X aria-hidden="true" className="size-5" />
          ) : (
            <Menu aria-hidden="true" className="size-5" />
          )}
        </button>
        <div className="flex-1" />
        <ThemeToggle />
      </div>
    </header>
  );
}
