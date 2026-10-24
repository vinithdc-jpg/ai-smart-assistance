import Image from "next/image";
import { LogOut } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";

type AdminTab =
  | "dashboard"
  | "clubs"
  | "staff"
  | "members"
  | "transactions"
  | "Report"
  | "settings";

export function AdminSidebar({
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  onMobileMenuClose,
  selectedClubId,
  loadStaff,
  handleLogout,
}: {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  mobileMenuOpen: boolean;
  onMobileMenuClose: () => void;
  selectedClubId: string;
  loadStaff: (clubId: string) => Promise<void>;
  handleLogout: () => void;
}) {
  function handleMobileTabChange(tab: AdminTab) {
    setActiveTab(tab);
    onMobileMenuClose();
    if (tab === "staff" && selectedClubId) {
      void loadStaff(selectedClubId);
    }
  }

  return (
    <>
      {mobileMenuOpen && (
        <div
          id="admin-mobile-navigation"
          className="fixed inset-x-0 bottom-0 top-16 z-40 bg-slate-950/30 lg:hidden"
          onClick={onMobileMenuClose}
        >
          <nav
            aria-label="Admin navigation"
            className="flex max-h-full w-72 max-w-[85vw] flex-col gap-1 overflow-y-auto border-r border-border bg-white p-3 shadow-xl dark:bg-slate-950"
            onClick={(event) => event.stopPropagation()}
          >
            {(
              [
                ["dashboard", "Dashboard"],
                ["clubs", "Clubs"],
                ["staff", "Staff Management"],
                ["members", "Members"],
                ["transactions", "Transactions"],
                ["Report", "Report"],
                ["settings", "GST Settings"],
              ] as const
            ).map(([tab, label]) => (
              <button
                key={tab}
                type="button"
                onClick={() => handleMobileTabChange(tab)}
                className={`w-full rounded-md px-3 py-3 text-left text-sm font-medium transition ${
                  activeTab === tab
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted hover:bg-primary-soft hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 flex w-full items-center gap-2 rounded-md border-t border-border px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </nav>
        </div>
      )}

      <aside className="hidden h-dvh w-60 shrink-0 flex-col border-r border-border bg-white lg:flex">
        <div className="flex items-center px-3 pt-3">
          <BrandLogo className="w-36" />
        </div>

        <nav className="mt-3 flex-1 space-y-1 overflow-y-auto px-3 pb-3 text-[14px] font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("dashboard")}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left cursor-pointer transition ${
              activeTab === "dashboard"
                ? "bg-primary text-white shadow-sm"
                : "text-muted hover:bg-primary-soft hover:text-foreground"
            }`}
          >
            <p className="m-1.2 bg-white rounded-[5px]">
              <Image
                src="/Admin/dashboard.png"
                alt="iMG"
                width={20}
                height={20}
              />
            </p>
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("clubs")}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left cursor-pointer transition ${
              activeTab === "clubs"
                ? "bg-primary text-white shadow-sm"
                : "text-muted hover:bg-primary-soft hover:text-foreground"
            }`}
          >
            <p className="m-1.2 bg-white rounded-[5px]">
              <Image
                src="/Admin/Club.png"
                alt="iMG"
                width={20}
                height={20}
              />{" "}
            </p>
            <span>Clubs</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("staff");
              if (selectedClubId) {
                void loadStaff(selectedClubId);
              }
            }}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 cursor-pointer text-left transition ${
              activeTab === "staff"
                ? "bg-primary text-white shadow-sm"
                : "text-muted hover:bg-primary-soft hover:text-foreground"
            }`}
          >
            <p className="m-1.2 bg-white rounded-[5px]">
              <Image src="/Admin/Staff.png" alt="iMG" width={20} height={20} />
            </p>
            <span>Staff Management</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("members")}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 cursor-pointer text-left transition ${
              activeTab === "members"
                ? "bg-primary text-white shadow-sm"
                : "text-muted hover:bg-primary-soft hover:text-foreground"
            }`}
          >
            <p className="m-1.2 bg-white rounded-[5px]">
              <Image
                src="/Admin/Members.png"
                alt="iMG"
                width={20}
                height={20}
              />
            </p>
            <span>Members</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("transactions")}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer text-left transition ${
              activeTab === "transactions"
                ? "bg-primary text-white shadow-sm"
                : "text-muted hover:bg-primary-soft hover:text-foreground"
            }`}
          >
            <p className="m-1.2 bg-white rounded-[5px]">
              <Image
                src="/Admin/Transction.png"
                alt="iMG"
                width={20}
                height={20}
              />
            </p>
            <span>Transactions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("Report")}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 cursor-pointer text-left transition ${
              activeTab === "Report"
                ? "bg-primary text-white shadow-sm"
                : "text-muted hover:bg-primary-soft hover:text-foreground"
            }`}
          >
            <p className="m-1.2 bg-white rounded-[5px]">
              <Image src="/Admin/Report.png" alt="iMG" width={20} height={20} />
            </p>
            <span>Report</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 cursor-pointer text-left transition ${
              activeTab === "settings"
                ? "bg-primary text-white shadow-sm"
                : "text-muted hover:bg-primary-soft hover:text-foreground"
            }`}
          >
            <p className="m-1.2 bg-white rounded-[5px]">
              <Image
                src="/Admin/Discount.png"
                alt="iMG"
                width={20}
                height={20}
              />
            </p>
            <span>GST Settings</span>
          </button>
        </nav>

        <div className="mt-auto shrink-0 border-t border-border p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 cursor-pointer text-xs font-medium text-muted transition hover:bg-red-50 hover:text-red-500"
          >
            <span>↪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
