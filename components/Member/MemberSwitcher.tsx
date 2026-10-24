"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import type { ApiMember } from "@/lib/membersApi";

interface MemberSwitcherProps {
  members: ApiMember[];
  selectedId?: string;
  onSelect: (member: ApiMember) => void;
  onAdd: () => void;
  onEdit: (member: ApiMember) => void;
  onDelete: (member: ApiMember) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function MemberSwitcher({
  members,
  selectedId,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  page,
  totalPages,
  onPageChange,
}: MemberSwitcherProps) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <span className="hidden h-11 shrink-0 items-center text-[11px] font-bold uppercase tracking-[0.18em] text-muted lg:inline-flex">
        Switch:
      </span>
      <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
        {members.map((member) => {
          const selected = member.id === selectedId;
          return (
            <div
              key={member.id}
              className={`group flex h-11 shrink-0 items-center rounded-full border pl-3 pr-1 ${
                selected
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white text-foreground"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelect(member)}
                className="flex h-11 items-center pr-2 text-left text-sm leading-none"
              >
                <span className="font-semibold whitespace-nowrap">
                  {member.first_name} {member.last_name}
                </span>
                <span
                  className={`ml-1 whitespace-nowrap text-xs ${
                    selected ? "text-white/80" : "text-muted"
                  }`}
                >
                  {member.member_id}
                </span>
              </button>
              <button
                type="button"
                title="Edit member"
                onClick={() => onEdit(member)}
                className={`flex h-8 w-8 items-center justify-center rounded-full opacity-70 hover:opacity-100 ${
                  selected ? "hover:bg-white/15" : "hover:bg-primary-soft"
                }`}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                title="Delete member"
                onClick={() => onDelete(member)}
                className={`flex h-8 w-8 items-center justify-center rounded-full opacity-70 hover:opacity-100 ${
                  selected ? "hover:bg-white/15" : "hover:bg-red-50"
                }`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
        <button
          type="button"
          onClick={onAdd}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-dashed border-primary/40 bg-white text-primary hover:bg-primary-soft"
          title="Add member"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {totalPages > 1 ? (
        <div className="hidden h-11 shrink-0 items-center gap-1 text-xs text-muted sm:flex">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="h-8 rounded-full border border-border px-2 disabled:opacity-40"
          >
            Prev
          </button>
          <span>
            {page}/{totalPages}
          </span>
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            className="h-8 rounded-full border border-border px-2 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
