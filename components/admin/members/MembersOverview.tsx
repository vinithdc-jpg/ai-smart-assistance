import type { ApiMember } from "@/lib/membersApi";
import { Pagination } from "@/components/admin/Pagination";
import { ActionIconButton } from "@/components/admin/ActionIconButton";
import MemberForm, { type MemberFormState } from "@/components/Member/MemberForm";
import { Search } from "lucide-react";

export function MembersOverview({
  memberClubFilter,
  loadingMembers,
  members,
  page,
  totalPages,
  onPageChange,
  onFilterChange,
  editingMember,
  memberForm,
  editLoading,
  editError,
  onEdit,
  onFormChange,
  onEditSubmit,
  onCancelEdit,
}: {
  memberClubFilter: string;
  onFilterChange: (value: string) => void;
  loadingMembers: boolean;
  members: ApiMember[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  editingMember: ApiMember | null;
  memberForm: MemberFormState;
  editLoading: boolean;
  editError: string;
  onEdit: (member: ApiMember) => void;
  onFormChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onEditSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancelEdit: () => void;
}) {
  return (
    <div className="space-y-4">
      {editingMember && (
        <div id="admin-member-edit-form">
          <MemberForm
            form={memberForm}
            editing
            loading={editLoading}
            error={editError}
            onChange={onFormChange}
            onSubmit={onEditSubmit}
            onCancel={onCancelEdit}
          />
        </div>
      )}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Members Overview</h2>
          <p className="text-sm text-muted">
            Super admin can view all member data or filter by club.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="memberClubFilter"
              type="search"
              value={memberClubFilter}
              onChange={(event) => onFilterChange(event.target.value)}
              placeholder="Search club name or ID"
              aria-label="Search members by club name or ID"
              className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-ring/40"
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        {loadingMembers ? (
          <div className="p-6 text-sm text-muted">Loading members...</div>
        ) : members.length === 0 ? (
          <div className="p-6 text-sm text-muted">No members found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#f7f8ff] text-xs uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Member ID</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Club</th>
                  <th className="px-4 py-3">Pending</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {member.first_name} {member.last_name}
                    </td>
                    <td className="px-4 py-3 text-muted">{member.member_id}</td>
                    <td className="px-4 py-3 text-muted">{member.email || "—"}</td>
                    <td className="px-4 py-3 text-muted">{member.phone || "—"}</td>
                    <td className="px-4 py-3 text-muted">{member.club_id}</td>
                    <td className="px-4 py-3 text-muted"><span className="m-1 font-bold">₹</span>{member.pending_amount}</td>
                    <td className="px-4 py-3 text-right">
                      <ActionIconButton
                        onClick={() => onEdit(member)}
                        alt="Edit member"
                        title="Edit member"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
    </div>
  );
}
