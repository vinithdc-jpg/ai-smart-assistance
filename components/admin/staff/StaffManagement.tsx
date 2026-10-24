import { ActionIconButton } from "@/components/admin/ActionIconButton";
import type { AdminClub } from "@/types/admin";
import type { Staff } from "@/types/auth";
import { Pagination } from "@/components/admin/Pagination";
import Select from "@/components/motion/select";

export function StaffManagement({
  clubs,
  selectedClubId,
  setSelectedClubId,
  selectedClub,
  staff,
  loadingStaff,
  showStaffForm,
  editingStaff,
  staffForm,
  staffFormLoading,
  setStaffForm,
  resetStaffForm,
  setShowStaffForm,
  handleStaffSubmit,
  startEditingStaff,
  handleDeleteStaff,
  page,
  totalPages,
  onPageChange,
}: {
  clubs: AdminClub[];
  selectedClubId: string;
  setSelectedClubId: (value: string) => void;
  selectedClub: AdminClub | null;
  staff: Staff[];
  loadingStaff: boolean;
  showStaffForm: boolean;
  editingStaff: Staff | null;
  staffForm: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    status: string;
  };
  staffFormLoading: boolean;
  setStaffForm: (value: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    status: string;
  }) => void;
  resetStaffForm: () => void;
  setShowStaffForm: (value: boolean) => void;
  handleStaffSubmit: (e: React.FormEvent) => void;
  startEditingStaff: (member: Staff) => void;
  handleDeleteStaff: (staffId: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const fieldClass =
    "h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-ring/40 disabled:opacity-50";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        {/* Header */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              Staff Management
            </h2>

            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              Staff
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            {selectedClubId === "all"
              ? "Viewing staff from all clubs"
              : selectedClub
                ? `Club: ${selectedClub.title}`
                : "Choose a club"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto md:items-center">
          <div className="w-full sm:w-52">
            <Select
              value={selectedClubId}
              onChange={(event) => setSelectedClubId(event.target.value)}
              className="h-10 w-full"
            >
              {clubs.length === 0 ? (
                <option value="">No clubs</option>
              ) : (
                <>
                  <option value="all">All Clubs</option>
                  {clubs.map((club) => (
                    <option key={club.clubId} value={club.clubId}>
                      {club.title}
                    </option>
                  ))}
                </>
              )}
            </Select>
          </div>

          <button
            type="button"
            onClick={() => {
              resetStaffForm();
              setShowStaffForm(true);
            }}
            disabled={!selectedClubId || selectedClubId === "all"}
            className="
        inline-flex h-10 w-full shrink-0 items-center justify-center gap-2
        rounded-lg
        bg-primary
        px-4
        text-sm font-semibold text-white
        shadow-sm
        transition-all duration-200
        hover:bg-primary-hover
        hover:shadow-md
        active:scale-[0.98]
        focus:outline-none
        focus:ring-2 focus:ring-primary/20
        disabled:cursor-not-allowed
        disabled:opacity-50
        sm:w-auto
      "
          >
            <span className="text-lg leading-none">+</span>
            <span>Add Staff</span>
          </button>
        </div>
      </div>

      {showStaffForm &&
        selectedClubId &&
        (selectedClubId !== "all" || editingStaff) && (
          <form
            id="admin-staff-edit-form"
            onSubmit={handleStaffSubmit}
            className="rounded-2xl border border-border bg-white p-4 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">
                {editingStaff ? "Edit Staff" : "Add Staff"}
              </h3>
              <button
                type="button"
                onClick={resetStaffForm}
                className="text-sm text-muted hover:text-foreground cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="form-floating-field">
                <span className="form-floating-label">First Name</span>
                <input
                  type="text"
                  value={staffForm.firstName}
                  placeholder=" "
                  onChange={(event) =>
                    setStaffForm({
                      ...staffForm,
                      firstName: event.target.value,
                    })
                  }
                  className={`${fieldClass} form-floating-input`}
                  required
                />
              </label>

              <label className="form-floating-field">
                <span className="form-floating-label">Last Name</span>
                <input
                  type="text"
                  value={staffForm.lastName}
                  placeholder=" "
                  onChange={(event) =>
                    setStaffForm({ ...staffForm, lastName: event.target.value })
                  }
                  className={`${fieldClass} form-floating-input`}
                  required
                />
              </label>

              <label className="form-floating-field md:col-span-2">
                <span className="form-floating-label">Email</span>
                <input
                  type="email"
                  value={staffForm.email}
                  placeholder=" "
                  onChange={(event) =>
                    setStaffForm({ ...staffForm, email: event.target.value })
                  }
                  pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
                  title="Please enter a valid email address, such as example@example.com"
                  className={`${fieldClass} form-floating-input`}
                  required
                />
              </label>

              {!editingStaff && (
                <div className="md:col-span-2">
                  <label className="form-floating-field">
                    <span className="form-floating-label">Password</span>
                    <input
                      type="password"
                      value={staffForm.password}
                      placeholder=" "
                      onChange={(event) =>
                        setStaffForm({
                          ...staffForm,
                          password: event.target.value,
                        })
                      }
                      className={`${fieldClass} form-floating-input`}
                      required
                    />
                  </label>
                  {staffForm.password &&
                    (() => {
                        let score = 0;
                        if (staffForm.password.length >= 8) score += 1;
                        if (/[A-Z]/.test(staffForm.password)) score += 1;
                        if (/[0-9]/.test(staffForm.password)) score += 1;
                        if (/[^A-Za-z0-9]/.test(staffForm.password)) score += 1;

                        let color = "bg-red-500";
                        let label = "Weak";
                        let filledBars = 1;

                        if (score === 2 || score === 3) {
                          color = "bg-yellow-500";
                          label = "Good";
                          filledBars = 2;
                        } else if (score === 4) {
                          color = "bg-green-500";
                          label = "Strong";
                          filledBars = 3;
                        }

                        return (
                          <div className="mt-2 flex items-center gap-2 text-xs">
                            <div className="flex h-1.5 flex-1 gap-1">
                              <div
                                className={`h-full flex-1 rounded-full ${filledBars >= 1 ? color : "bg-gray-200"}`}
                              />
                              <div
                                className={`h-full flex-1 rounded-full ${filledBars >= 2 ? color : "bg-gray-200"}`}
                              />
                              <div
                                className={`h-full flex-1 rounded-full ${filledBars >= 3 ? color : "bg-gray-200"}`}
                              />
                            </div>
                            <span className="w-12 text-right font-medium text-muted">
                              {label}
                            </span>
                          </div>
                        );
                    })()}
                </div>
              )}

              <label className="space-y-2 text-sm text-muted">
                <span>Role</span>
                <Select
                  value={staffForm.role}
                  onChange={(event) =>
                    setStaffForm({ ...staffForm, role: event.target.value })
                  }
                  className="h-10"
                >
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </Select>
              </label>

              <label className="space-y-2 text-sm text-muted">
                <span>Status</span>
                <Select
                  value={staffForm.status}
                  onChange={(event) =>
                    setStaffForm({ ...staffForm, status: event.target.value })
                  }
                  className="h-10"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </label>
            </div>

            <div className="mt-4 flex">
              <button
                type="submit"
                disabled={staffFormLoading}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 cursor-pointer"
              >
                {staffFormLoading
                  ? "Saving..."
                  : editingStaff
                    ? "Update Staff"
                    : "Create Staff"}
              </button>
            </div>
          </form>
        )}

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        {!selectedClubId ? (
          <div className="p-6 text-sm text-muted">
            Select a club to view staff.
          </div>
        ) : loadingStaff ? (
          <div className="p-6 text-sm text-muted">Loading staff...</div>
        ) : staff.length === 0 ? (
          <div className="p-6 text-sm text-muted">
            {selectedClubId === "all"
              ? "No staff found across all clubs."
              : "No staff for this club yet."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#f7f8ff] text-xs uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {member.firstName} {member.lastName}
                    </td>
                    <td className="px-4 py-3 text-muted">{member.email}</td>
                    <td className="px-4 py-3 text-muted">{member.role}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                          member.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ActionIconButton
                          src="/edit.png"
                          alt="Edit staff"
                          title="Edit staff"
                          onClick={() => startEditingStaff(member)}
                        />
                        <ActionIconButton
                          src="/deactivate.png"
                          alt="Deactivate staff"
                          title="Deactivate staff"
                          onClick={() => handleDeleteStaff(member.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
