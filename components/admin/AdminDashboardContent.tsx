"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/components/hooks/useDebounce";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";
import { ClubManagement } from "@/components/admin/clubs/ClubManagement";
import { DashboardOverview } from "@/components/admin/dashboard/DashboardOverview";
import { MembersOverview } from "@/components/admin/members/MembersOverview";
import { StaffManagement } from "@/components/admin/staff/StaffManagement";
import { TransactionsOverview } from "@/components/admin/transactions/TransactionsOverview";
import { GstSettings } from "@/components/admin/settings/GstSettings";
import {
  getClubs,
  createClub,
  updateClub,
  deactivateClub,
  getStaffByClub,
  createStaff,
  updateStaff,
  deleteStaff,
  adminLogout,
  getGstRate,
  updateGstRate,
} from "@/lib/adminApi";
import { AdminClub } from "@/types/admin";
import { Staff } from "@/types/auth";
import { getMembers, updateMember, type ApiMember } from "@/lib/membersApi";
import type { MemberFormState } from "@/components/Member/MemberForm";
import {
  getTransactions,
  updateTransaction,
  type ApiTransaction,
} from "@/lib/transactionsApi";
import ConfirmModal from "@/components/ui/ConfirmModal";
import PopMessage, { type PopMessageType } from "@/components/ui/PopMessage";
import Report from "./Report";
import BackNavigationLogoutGuard from "@/components/BackNavigationLogoutGuard";
import { toast } from "react-toastify";
import { toIndiaDateValue } from "@/components/Member/money";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function AdminDashboardContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "clubs"
    | "staff"
    | "members"
    | "transactions"
    | "Report"
    | "settings"
  >("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [clubs, setClubs] = useState<AdminClub[]>([]);
  const [selectedClubId, setSelectedClubId] = useState<string>("");
  const [staff, setStaff] = useState<Staff[]>([]);
  const [allStaff, setAllStaff] = useState<Staff[]>([]);
  const [members, setMembers] = useState<ApiMember[]>([]);
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [clubsPage, setClubsPage] = useState(1);
  const [clubsTotalPages, setClubsTotalPages] = useState(1);
  const [staffPage, setStaffPage] = useState(1);
  const [staffTotalPages, setStaffTotalPages] = useState(1);
  const [staffCount, setStaffCount] = useState(0);
  const [membersPage, setMembersPage] = useState(1);
  const [membersTotalPages, setMembersTotalPages] = useState(1);
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [transactionsTotalPages, setTransactionsTotalPages] = useState(1);
  const [memberClubFilter, setMemberClubFilter] = useState<string>("");
  const [transactionClubFilter, setTransactionClubFilter] =
    useState<string>("");
  const debouncedMemberSearch = useDebounce(memberClubFilter, 300);
  const debouncedTransactionSearch = useDebounce(transactionClubFilter, 300);
  const [editingMember, setEditingMember] = useState<ApiMember | null>(null);
  const [memberForm, setMemberForm] = useState<MemberFormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    memberId: "",
    pendingAmount: "",
    amcStatus: "active",
  });
  const [editingTransaction, setEditingTransaction] =
    useState<ApiTransaction | null>(null);
  const [transactionForm, setTransactionForm] = useState({
    receivedAmount: "",
    paymentMethod: "cash",
    remarks: "",
    date: "",
  });
  const [adminEditLoading, setAdminEditLoading] = useState(false);
  const [adminEditError, setAdminEditError] = useState("");

  const [gstRate, setGstRate] = useState<number>(18);
  const [gstRateInput, setGstRateInput] = useState<string>("18");
  const [gstLoading, setGstLoading] = useState<boolean>(false);
  const [gstSuccess, setGstSuccess] = useState<string>("");
  const [gstError, setGstError] = useState<string>("");

  const [loadingClubs, setLoadingClubs] = useState(true);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [error, setError] = useState("");

  const [showClubForm, setShowClubForm] = useState(false);
  const [editingClub, setEditingClub] = useState<AdminClub | null>(null);
  const [clubForm, setClubForm] = useState({
    club_id: "",
    title: "",
    phone: "",
    status: "active",
  });
  const [clubFormLoading, setClubFormLoading] = useState(false);

  const [showStaffForm, setShowStaffForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [staffForm, setStaffForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "staff",
    status: "active",
  });
  const [staffFormLoading, setStaffFormLoading] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState<
    | { type: "logout" }
    | { type: "club"; clubId: string }
    | { type: "staff"; staffId: string }
    | null
  >(null);
  const [popMsg, setPopMsg] = useState<{
    message: string;
    type: PopMessageType;
  } | null>(null);

  useEffect(() => {
    const formId =
      activeTab === "clubs" && editingClub
        ? "admin-club-edit-form"
        : activeTab === "staff" && editingStaff
          ? "admin-staff-edit-form"
          : activeTab === "members" && editingMember
            ? "admin-member-edit-form"
            : activeTab === "transactions" && editingTransaction
              ? "admin-transaction-edit-form"
              : null;
    if (!formId) return;

    const frame = window.requestAnimationFrame(() => {
      const form = document.getElementById(formId);
      if (!form) return;
      form.scrollIntoView({ behavior: "smooth", block: "center" });
      form
        .querySelector<HTMLElement>(
          "input:not(:disabled), select:not(:disabled), textarea:not(:disabled)",
        )
        ?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeTab, editingClub, editingStaff, editingMember, editingTransaction]);

  type StaffPayload = {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    status: string;
    club_id?: string;
    password?: string;
  };

  const totalClubs = clubs.length;
  const activeClubs = clubs.filter((club) => club.status === "active").length;
  const inactiveClubs = totalClubs - activeClubs;
  const totalStaff = staffCount;
  const selectedClub =
    clubs.find((club) => club.clubId === selectedClubId) ?? null;

  useEffect(() => {
    void loadClubs();
    void loadGstRate();
  }, []);

  async function loadGstRate() {
    try {
      const res = await getGstRate();
      if (res.success && res.gstRate !== undefined) {
        setGstRate(res.gstRate);
        setGstRateInput(String(res.gstRate));
      }
    } catch (err) {
      console.error("Failed to load GST rate:", err);
    }
  }

  async function handleSaveGstRate(e: React.FormEvent) {
    e.preventDefault();
    setGstLoading(true);
    setGstSuccess("");
    setGstError("");
    try {
      const parsed = Number(gstRateInput);
      if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
        throw new Error("Please enter a valid percentage between 0 and 100.");
      }
      const res = await updateGstRate(parsed);
      if (res.success) {
        setGstRate(res.gstRate);
        setGstSuccess(`GST rate successfully updated to ${res.gstRate}%.`);
      } else {
        throw new Error(res.message || "Failed to update GST rate.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update GST rate.";
      setGstError(message);
    } finally {
      setGstLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === "staff" && selectedClubId) {
      void loadStaff(selectedClubId, 1);
    }
  }, [activeTab, selectedClubId]);

  useEffect(() => {
    if (activeTab === "members") {
      void loadMembers(debouncedMemberSearch, membersPage);
    }
  }, [activeTab, debouncedMemberSearch, membersPage]);

  useEffect(() => {
    if (activeTab === "transactions") {
      void loadTransactions(debouncedTransactionSearch, transactionsPage);
    }
  }, [activeTab, debouncedTransactionSearch, transactionsPage]);

  async function loadClubs(page = clubsPage) {
    setLoadingClubs(true);
    setError("");
    try {
      const res = await getClubs(page);
      const clubList = res.clubs || [];
      setClubs(clubList);
      setClubsPage(res.page);
      setClubsTotalPages(res.totalPages);

      if (clubList.length > 0) {
        setSelectedClubId((prevId) => {
          if (
            prevId === "all" ||
            (prevId && clubList.some((club) => club.clubId === prevId))
          ) {
            return prevId;
          }
          return "all";
        });

        const staffResult = await getStaffByClub("all", staffPage);
        setAllStaff(staffResult.staff || []);
        setStaffCount(staffResult.count);
        setStaffTotalPages(staffResult.totalPages);
      } else {
        setSelectedClubId("");
        setStaff([]);
        setAllStaff([]);
      }
    } catch {
      setError("Failed to load clubs");
    } finally {
      setLoadingClubs(false);
    }
  }

  async function loadStaff(clubId: string, page = staffPage) {
    if (!clubId) return;
    setLoadingStaff(true);
    try {
      const res = await getStaffByClub(clubId, page);
      setStaff(res.staff || []);
      setStaffPage(res.page);
      setStaffTotalPages(res.totalPages);
      if (clubId === "all") {
        setAllStaff(res.staff || []);
        setStaffCount(res.count);
      }
    } catch {
      setError("Failed to load staff for selected club");
    } finally {
      setLoadingStaff(false);
    }
  }

  async function loadMembers(search = "", page = membersPage) {
    setLoadingMembers(true);
    setError("");
    try {
      const request = {
        search,
        page,
        limit: 10,
      };
      const response = await getMembers(request);
      setMembers(response.members || []);
      setMembersPage(response.page);
      setMembersTotalPages(response.totalPages);
    } catch {
      setError("Failed to load members");
    } finally {
      setLoadingMembers(false);
    }
  }

  async function loadTransactions(search = "", page = transactionsPage) {
    setLoadingTransactions(true);
    setError("");
    try {
      const request = {
        search,
        page,
        limit: 10,
      };
      const response = await getTransactions(request);
      setTransactions(response.transactions || []);
      setTransactionsPage(response.page);
      setTransactionsTotalPages(response.totalPages);
    } catch {
      setError("Failed to load transactions");
    } finally {
      setLoadingTransactions(false);
    }
  }

  async function handleLogout() {
    setPendingConfirmation({ type: "logout" });
  }

  async function confirmPendingAction() {
    if (!pendingConfirmation) return;

    const action = pendingConfirmation;
    setPendingConfirmation(null);
    try {
      if (action.type === "logout") {
        await adminLogout();
        router.replace("/Admin/login");
      } else if (action.type === "club") {
        await deactivateClub(action.clubId);
        await loadClubs();
        setPopMsg({
          message: "Club deactivated successfully.",
          type: "success",
        });
      } else {
        await deleteStaff(action.staffId, selectedClubId);
        if (selectedClubId === "all") {
          await loadClubs();
        } else {
          await loadStaff(selectedClubId);
        }
        setPopMsg({ message: "Staff member deactivated.", type: "success" });
      }
    } catch {
      const errMsg =
        action.type === "logout"
          ? "Logout failed"
          : action.type === "club"
            ? "Failed to deactivate club"
            : "Failed to deactivate staff";
      setPopMsg({ message: errMsg, type: "error" });
    }
  }

  function resetClubForm() {
    setEditingClub(null);
    setClubForm({ club_id: "", title: "", phone: "", status: "active" });
    setShowClubForm(false);
  }

  function startEditingClub(club: AdminClub) {
    setEditingClub(club);
    setClubForm({
      club_id: club.clubId,
      title: club.title,
      phone: club.phone || "",
      status: club.status,
    });
    setShowClubForm(true);
  }

  async function handleClubSubmit(e: React.FormEvent) {
    e.preventDefault();
    setClubFormLoading(true);
    setError("");
    try {
      if (editingClub) {
        await updateClub(editingClub.clubId, {
          title: clubForm.title,
          phone: clubForm.phone,
          status: clubForm.status,
        });
      } else {
        await createClub({
          club_id: clubForm.club_id,
          title: clubForm.title,
          phone: clubForm.phone,
          status: clubForm.status,
        });
      }
      toast.success(
        editingClub
          ? "Club updated successfully."
          : "Club created successfully.",
      );
      resetClubForm();
      await loadClubs();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save club");
    } finally {
      setClubFormLoading(false);
    }
  }

  async function handleDeleteClub(clubId: string) {
    setPendingConfirmation({ type: "club", clubId });
  }

  function resetStaffForm() {
    setEditingStaff(null);
    setStaffForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "staff",
      status: "active",
    });
    setShowStaffForm(false);
  }

  function startEditingStaff(member: Staff) {
    setEditingStaff(member);
    setStaffForm({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      password: "",
      role: member.role,
      status: member.status,
    });
    setShowStaffForm(true);
  }

  async function handleStaffSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStaffFormLoading(true);
    setError("");

    try {
      if (!selectedClubId) {
        toast.error("Please select a club first");
        return;
      }

      const email = staffForm.email.trim().toLowerCase();
      if (!emailPattern.test(email)) {
        toast.error(
          "Please enter a valid email address, such as example@example.com.",
        );
        return;
      }

      if (editingStaff) {
        const payload: StaffPayload = {
          first_name: staffForm.firstName,
          last_name: staffForm.lastName,
          email,
          role: staffForm.role,
          status: staffForm.status,
          club_id: selectedClubId === "all" ? undefined : selectedClubId,
        };
        if (staffForm.password) {
          payload.password = staffForm.password;
        }
        await updateStaff(editingStaff.id, payload);
      } else {
        if (selectedClubId === "all") {
          toast.error("Please select a specific club to add staff.");
          return;
        }
        await createStaff({
          first_name: staffForm.firstName,
          last_name: staffForm.lastName,
          email,
          password: staffForm.password,
          role: staffForm.role,
          status: staffForm.status,
          club_id: selectedClubId,
        });
      }

      toast.success(
        editingStaff
          ? "Staff member updated successfully."
          : "Staff member created successfully.",
      );
      resetStaffForm();
      if (selectedClubId === "all") {
        await loadClubs();
      } else {
        await loadStaff(selectedClubId);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save staff");
    } finally {
      setStaffFormLoading(false);
    }
  }

  async function handleDeleteStaff(staffId: string) {
    setPendingConfirmation({ type: "staff", staffId });
  }

  function handleMemberFilterChange(value: string) {
    setMemberClubFilter(value);
    setMembersPage(1);
  }

  function handleTransactionFilterChange(value: string) {
    setTransactionClubFilter(value);
    setTransactionsPage(1);
  }

  function startEditingMember(member: ApiMember) {
    setEditingMember(member);
    setMemberForm({
      firstName: member.first_name,
      lastName: member.last_name,
      email: member.email || "",
      phone: member.phone || "",
      memberId: member.member_id,
      pendingAmount: String(member.pending_amount ?? "0"),
      amcStatus: member.amc_status || "active",
    });
    setAdminEditError("");
  }

  function resetMemberEdit() {
    setEditingMember(null);
    setAdminEditError("");
  }

  async function handleMemberEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingMember) return;
    setAdminEditLoading(true);
    setAdminEditError("");
    try {
      await updateMember(editingMember.id, {
        firstName: memberForm.firstName,
        lastName: memberForm.lastName,
        email: memberForm.email,
        phone: memberForm.phone,
        pendingAmount: Number(memberForm.pendingAmount),
        amcStatus: memberForm.amcStatus,
      });
      resetMemberEdit();
      await loadMembers(memberClubFilter, membersPage);
    } catch (err: unknown) {
      setAdminEditError(
        err instanceof Error ? err.message : "Failed to update member",
      );
    } finally {
      setAdminEditLoading(false);
    }
  }

  function startEditingTransaction(transaction: ApiTransaction) {
    setEditingTransaction(transaction);
    setTransactionForm({
      receivedAmount: String(transaction.received_amount ?? "0"),
      paymentMethod: transaction.payment_method || "cash",
      remarks: transaction.remarks || "",
      date: transaction.amount_taken_date
        ? toIndiaDateValue(transaction.amount_taken_date)
        : "",
    });
    setAdminEditError("");
  }

  function resetTransactionEdit() {
    setEditingTransaction(null);
    setAdminEditError("");
  }

  async function handleTransactionEditSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();
    if (!editingTransaction) return;
    setAdminEditLoading(true);
    setAdminEditError("");
    try {
      await updateTransaction(editingTransaction.id, {
        receivedAmount: Number(transactionForm.receivedAmount),
        paymentMethod: transactionForm.paymentMethod,
        remarks: transactionForm.remarks,
        date: transactionForm.date || undefined,
      });
      resetTransactionEdit();
      await loadTransactions(transactionClubFilter, transactionsPage);
    } catch (err: unknown) {
      setAdminEditError(
        err instanceof Error ? err.message : "Failed to update transaction",
      );
    } finally {
      setAdminEditLoading(false);
    }
  }

  function handleStaffPageChange(page: number) {
    setStaffPage(page);
    void loadStaff(selectedClubId || "all", page);
  }

  function handleActiveTabChange(tab: string) {
    if (
      tab === "dashboard" ||
      tab === "clubs" ||
      tab === "staff" ||
      tab === "members" ||
      tab === "transactions" ||
      tab === "Report" ||
      tab === "settings"
    ) {
      setActiveTab(tab);
      setMobileMenuOpen(false);
    }
  }

  return (
    <AdminProtectedRoute>
      <div className="min-h-dvh overflow-x-hidden bg-white text-foreground antialiased lg:fixed lg:inset-0 lg:h-dvh lg:overflow-hidden">
        <BackNavigationLogoutGuard
          loginPath="/Admin/login"
          logout={adminLogout}
          admin
        />
        <div className="flex min-h-dvh flex-col lg:h-full lg:min-h-0 lg:flex-row">
          <AdminSidebar
            activeTab={activeTab}
            setActiveTab={handleActiveTabChange}
            mobileMenuOpen={mobileMenuOpen}
            onMobileMenuClose={() => setMobileMenuOpen(false)}
            selectedClubId={selectedClubId}
            loadStaff={loadStaff}
            handleLogout={handleLogout}
          />

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <AdminHeader
              mobileMenuOpen={mobileMenuOpen}
              onMobileMenuToggle={() =>
                setMobileMenuOpen((isOpen) => !isOpen)
              }
            />

            <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
              <div className="mx-auto w-full max-w-7xl min-w-0 space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {activeTab === "dashboard" && <DashboardOverview />}

                {activeTab === "clubs" && (
                  <ClubManagement
                    clubs={clubs}
                    loadingClubs={loadingClubs}
                    showClubForm={showClubForm}
                    editingClub={editingClub}
                    clubForm={clubForm}
                    clubFormLoading={clubFormLoading}
                    setClubForm={setClubForm}
                    resetClubForm={resetClubForm}
                    setShowClubForm={setShowClubForm}
                    handleClubSubmit={handleClubSubmit}
                    startEditingClub={startEditingClub}
                    handleDeleteClub={handleDeleteClub}
                    page={clubsPage}
                    totalPages={clubsTotalPages}
                    onPageChange={(page) => void loadClubs(page)}
                  />
                )}

                {activeTab === "members" && (
                  <MembersOverview
                    memberClubFilter={memberClubFilter}
                    onFilterChange={handleMemberFilterChange}
                    loadingMembers={loadingMembers}
                    members={members}
                    page={membersPage}
                    totalPages={membersTotalPages}
                    onPageChange={setMembersPage}
                    editingMember={editingMember}
                    memberForm={memberForm}
                    editLoading={adminEditLoading}
                    editError={adminEditError}
                    onEdit={startEditingMember}
                    onFormChange={(event) =>
                      setMemberForm((current) => ({
                        ...current,
                        [event.target.name]: event.target.value,
                      }))
                    }
                    onEditSubmit={handleMemberEditSubmit}
                    onCancelEdit={resetMemberEdit}
                  />
                )}

                {activeTab === "transactions" && (
                  <TransactionsOverview
                    transactionClubFilter={transactionClubFilter}
                    onFilterChange={handleTransactionFilterChange}
                    loadingTransactions={loadingTransactions}
                    transactions={transactions}
                    page={transactionsPage}
                    totalPages={transactionsTotalPages}
                    onPageChange={setTransactionsPage}
                    editingTransaction={editingTransaction}
                    transactionForm={transactionForm}
                    editLoading={adminEditLoading}
                    editError={adminEditError}
                    onEdit={startEditingTransaction}
                    onFormChange={(event) =>
                      setTransactionForm((current) => ({
                        ...current,
                        [event.target.name]: event.target.value,
                      }))
                    }
                    onEditSubmit={handleTransactionEditSubmit}
                    onCancelEdit={resetTransactionEdit}
                  />
                )}

                {activeTab === "Report" && <Report />}

                {activeTab === "staff" && (
                  <StaffManagement
                    clubs={clubs}
                    selectedClubId={selectedClubId}
                    setSelectedClubId={setSelectedClubId}
                    selectedClub={selectedClub}
                    staff={selectedClubId === "all" ? allStaff : staff}
                    loadingStaff={loadingStaff}
                    showStaffForm={showStaffForm}
                    editingStaff={editingStaff}
                    staffForm={staffForm}
                    staffFormLoading={staffFormLoading}
                    setStaffForm={setStaffForm}
                    resetStaffForm={resetStaffForm}
                    setShowStaffForm={setShowStaffForm}
                    handleStaffSubmit={handleStaffSubmit}
                    startEditingStaff={startEditingStaff}
                    handleDeleteStaff={handleDeleteStaff}
                    page={staffPage}
                    totalPages={staffTotalPages}
                    onPageChange={handleStaffPageChange}
                  />
                )}

                {activeTab === "settings" && (
                  <GstSettings
                    gstRate={gstRate}
                    gstRateInput={gstRateInput}
                    gstLoading={gstLoading}
                    gstSuccess={gstSuccess}
                    gstError={gstError}
                    setGstRateInput={setGstRateInput}
                    handleSaveGstRate={handleSaveGstRate}
                  />
                )}
              </div>
            </main>
            <ConfirmModal
              isOpen={Boolean(pendingConfirmation)}
              title={
                pendingConfirmation?.type === "logout"
                  ? "Sign out?"
                  : pendingConfirmation?.type === "staff"
                    ? "Delete staff member?"
                    : "Confirm deactivation?"
              }
              message={
                pendingConfirmation?.type === "logout"
                  ? "Are you sure you want to log out of the admin dashboard?"
                  : pendingConfirmation?.type === "club"
                    ? "Are you sure you want to deactivate this club?"
                    : "Are you sure you want to delete this staff member?"
              }
              confirmText={
                pendingConfirmation?.type === "logout"
                  ? "Sign out"
                  : pendingConfirmation?.type === "staff"
                    ? "Delete"
                    : "Deactivate"
              }
              variant={
                pendingConfirmation?.type === "logout" ? "logout" : "danger"
              }
              onClose={() => setPendingConfirmation(null)}
              onConfirm={() => void confirmPendingAction()}
            />
            {popMsg && (
              <PopMessage
                message={popMsg.message}
                type={popMsg.type}
                onClose={() => setPopMsg(null)}
              />
            )}
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}
