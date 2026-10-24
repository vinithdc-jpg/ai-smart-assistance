import { ActionIconButton } from "@/components/admin/ActionIconButton";
import { Pagination } from "@/components/admin/Pagination";
import type { AdminClub } from "@/types/admin";
import Select from "@/components/motion/select";

export function ClubManagement({
  clubs,
  loadingClubs,
  showClubForm,
  editingClub,
  clubForm,
  clubFormLoading,
  setClubForm,
  resetClubForm,
  setShowClubForm,
  handleClubSubmit,
  startEditingClub,
  handleDeleteClub,
  page,
  totalPages,
  onPageChange,
}: {
  clubs: AdminClub[];
  loadingClubs: boolean;
  showClubForm: boolean;
  editingClub: AdminClub | null;
  clubForm: { club_id: string; title: string; phone: string; status: string };
  clubFormLoading: boolean;
  setClubForm: (value: {
    club_id: string;
    title: string;
    phone: string;
    status: string;
  }) => void;
  resetClubForm: () => void;
  setShowClubForm: (value: boolean) => void;
  handleClubSubmit: (e: React.FormEvent) => void;
  startEditingClub: (club: AdminClub) => void;
  handleDeleteClub: (clubId: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const fieldClass =
    "h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-ring/40 disabled:opacity-50";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Club Directory
            </h2>

            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              Clubs
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Manage club records and activation status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetClubForm();
            setShowClubForm(true);
          }}
          className="
      inline-flex h-10 items-center justify-center gap-2
      rounded-lg
      bg-primary
      px-4
      text-sm font-semibold text-white
      shadow-sm
      transition-all
      hover:bg-primary-hover
      hover:shadow-md
      active:scale-[0.98]
      focus:outline-none
      focus:ring-2 focus:ring-primary/20
    "
        >
          <span className="text-lg leading-none">+</span>
          Add Club
        </button>
      </div>

      {showClubForm && (
        <form
          id="admin-club-edit-form"
          onSubmit={handleClubSubmit}
          className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
        >
          {/* Header */}
          <div className="border-b border-border px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {editingClub ? "Edit Club" : "Create New Club"}
                </h3>

                <p className="mt-1 text-sm text-muted">
                  {editingClub
                    ? "Update the club information and settings."
                    : "Add a new club to your organization."}
                </p>
              </div>

              <button
                type="button"
                onClick={resetClubForm}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-muted/10 hover:text-foreground"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Form Body */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Club ID */}
              {!editingClub && (
                <div>
                  <label htmlFor="club_id" className="form-floating-field">
                    <span className="form-floating-label">
                      Club ID <span className="text-red-500">*</span>
                    </span>
                  <input
                    id="club_id"
                    type="text"
                    placeholder=" "
                    value={clubForm.club_id}
                    onChange={(event) =>
                      setClubForm({
                        ...clubForm,
                        club_id: event.target.value,
                      })
                    }
                    className={`${fieldClass} w-full form-floating-input`}
                    required
                  />
                  </label>

                  <p className="mt-2 text-xs text-muted">
                    A unique identifier for this club.
                  </p>
                </div>
              )}

              {/* Club Title */}
              <div>
                <label htmlFor="club_title" className="form-floating-field">
                  <span className="form-floating-label">
                    Club Name <span className="text-red-500">*</span>
                  </span>
                <input
                  id="club_title"
                  type="text"
                  placeholder=" "
                  value={clubForm.title}
                  onChange={(event) =>
                    setClubForm({
                      ...clubForm,
                      title: event.target.value,
                    })
                  }
                  className={`${fieldClass} w-full form-floating-input`}
                  required
                />
                </label>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="club_phone" className="form-floating-field">
                  <span className="form-floating-label">Phone Number</span>
                <input
                  id="club_phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder=" "
                  value={clubForm.phone}
                  onChange={(event) =>
                    setClubForm({
                      ...clubForm,
                      phone: event.target.value.replace(/\D/g, ""),
                    })
                  }
                  maxLength={15}
                  pattern="[0-9]{10,15}"
                  title="Please enter a valid phone number"
                  className={`${fieldClass} w-full form-floating-input`}
                />
                </label>

                <p className="mt-2 text-xs text-muted">
                  Enter a valid 10–15 digit phone number.
                </p>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label
                  htmlFor="club_status"
                  className="text-sm font-medium text-foreground"
                >
                  Club Status <span className="text-red-500">*</span>
                </label>

                <Select
                  id="club_status"
                  value={clubForm.status}
                  onChange={(event) =>
                    setClubForm({
                      ...clubForm,
                      status: event.target.value,
                    })
                  }
                  className="h-10 w-full"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>

                <p className="text-xs text-muted">
                  Control whether this club is currently active.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-border bg-muted/5 px-6 py-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={resetClubForm}
              className="rounded-xl border border-border bg-white px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-muted/10"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={clubFormLoading}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {clubFormLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </span>
              ) : editingClub ? (
                "Update Club"
              ) : (
                "Create Club"
              )}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        {loadingClubs ? (
          <div className="p-6 text-sm text-muted">Loading clubs...</div>
        ) : clubs.length === 0 ? (
          <div className="p-6 text-sm text-muted">No clubs available.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#f7f8ff] text-xs uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th className="px-4 py-3">Club</th>
                  <th className="px-4 py-3">Club ID</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clubs.map((club) => (
                  <tr key={club.clubId} className="border-t border-border">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {club.title}
                    </td>
                    <td className="px-4 py-3 text-muted">{club.clubId}</td>
                    <td className="px-4 py-3 text-muted">
                      {club.phone || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                          club.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {club.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ActionIconButton
                          src="/edit.png"
                          alt="Edit club"
                          title="Edit club"
                          onClick={() => startEditingClub(club)}
                        />

                        <ActionIconButton
                          src="/deactivate.png"
                          alt="Deactivate club"
                          title={
                            club.status === "inactive"
                              ? "Club is already inactive"
                              : "Deactivate club"
                          }
                          onClick={() => handleDeleteClub(club.clubId)}
                          disabled={club.status === "inactive"}
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
