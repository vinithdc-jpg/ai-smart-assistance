"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import type { ApiMember } from "@/lib/membersApi";
import { useDebounce } from "@/components/hooks/useDebounce";

interface MemberSearchProps {
  members: ApiMember[];
  selectedMember?: ApiMember | null;
  loading?: boolean;
  onSearch: (query: string) => void;
  onSelect: (member: ApiMember) => void;
  onAdd: () => void;
  onEdit: (member: ApiMember) => void;
  onDelete: (member: ApiMember) => void;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

function memberLabel(member: ApiMember) {
  return `${member.first_name} ${member.last_name} (${member.member_id})`;
}

export default function MemberSearch({
  members,
  selectedMember,
  loading = false,
  onSearch,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  page = 1,
  totalPages = 1,
  onPageChange,
}: MemberSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 250);
  const rootRef = useRef<HTMLDivElement>(null);
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    onSearchRef.current(debouncedQuery);
  }, [debouncedQuery, open]);

  const filteredMembers = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return members;
    return members.filter((member) =>
      memberLabel(member).toLowerCase().includes(needle) ||
      (member.email || "").toLowerCase().includes(needle) ||
      (member.phone || "").includes(needle),
    );
  }, [members, query]);

  return (
    <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      <div className="flex items-center justify-between gap-2 sm:contents">
        <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-muted">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Users className="h-4 w-4" />
          </span>
          <span className="whitespace-nowrap sm:hidden">Active Member</span>
          <span className="hidden lg:inline">Active Member:</span>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-dashed border-primary/40 bg-white text-primary hover:bg-primary-soft sm:hidden"
          title="Add member"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div ref={rootRef} className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          id="member-search"
          type="text"
          placeholder="Search member by name or ID..."
          value={open ? query : selectedMember ? memberLabel(selectedMember) : query}
          onChange={(event) => {
            setQuery(event.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            setQuery("");
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
            if (event.key === "Enter" && filteredMembers[0]) {
              onSelect(filteredMembers[0]);
              setOpen(false);
              setQuery("");
            }
          }}
          className="h-11 w-full rounded-full border border-border bg-white pl-10 pr-10 text-sm text-foreground shadow-sm outline-none placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-ring/40"
        />
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-primary-soft hover:text-primary"
          aria-label="Toggle member list"
        >
          <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
        </button>

        {open ? (
          <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-white shadow-[0_18px_40px_rgba(31,35,80,0.12)]">
            <div className="max-h-[min(60vh,18rem)] overflow-y-auto py-1 lg:max-h-72">
              {loading ? (
                <p className="px-4 py-6 text-center text-sm text-muted">
                  Loading members...
                </p>
              ) : filteredMembers.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-muted">
                  No members found.
                </p>
              ) : (
                filteredMembers.map((member) => {
                  const selected = selectedMember?.id === member.id;
                  return (
                    <div
                      key={member.id}
                      className={`flex items-center gap-2 px-2 py-1 ${
                        selected ? "bg-primary-soft" : "hover:bg-[#f6f7ff]"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onSelect(member);
                          setOpen(false);
                          setQuery("");
                        }}
                        className="min-w-0 flex-1 rounded-xl px-2 py-2 text-left"
                      >
                        <span className="block truncate text-sm font-semibold">
                          {member.first_name} {member.last_name}
                        </span>
                        <span className="block truncate text-xs text-muted">
                          {member.member_id}
                          {member.email ? ` • ${member.email}` : ""}
                        </span>
                      </button>
                      <button
                        type="button"
                        title="Edit member"
                        onClick={() => onEdit(member)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-white hover:text-primary"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        title="Delete member"
                        onClick={() => onDelete(member)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
            {totalPages > 1 ? (
              <div className="flex items-center justify-between border-t border-border px-3 py-2 text-xs text-muted">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => onPageChange?.(page - 1)}
                  className="rounded-full px-2 py-1 disabled:opacity-40"
                >
                  Prev
                </button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => onPageChange?.(page + 1)}
                  className="rounded-full px-2 py-1 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="hidden h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary-soft px-4 text-sm font-semibold text-primary transition-colors hover:border-primary/50 hover:bg-primary/10 sm:flex"
        title="Add member"
      >
        <Plus className="h-4 w-4" />
        <span>Add member</span>
      </button>
    </div>
  );
}
