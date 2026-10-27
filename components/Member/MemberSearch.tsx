"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
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
    return members.filter(
      (member) =>
        memberLabel(member).toLowerCase().includes(needle) ||
        (member.email || "").toLowerCase().includes(needle) ||
        (member.phone || "").includes(needle),
    );
  }, [members, query]);

  return (
    <div className="flex w-full min-w-0 flex-wrap items-center gap-x-4 gap-y-3 sm:flex-nowrap sm:gap-x-5">
      <div className="flex shrink-0 items-center gap-2.5 text-sm font-medium text-foreground">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Users className="h-4 w-4" />
        </span>
        <span className="whitespace-nowrap">Active Member</span>
      </div>

      <div
        ref={rootRef}
        className="relative order-3 min-w-0 w-full sm:order-0 sm:flex-1"
      >
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
        <input
          id="member-search"
          type="text"
          placeholder="Search members by name, ID, email, or phone..."
          value={
            open ? query : selectedMember ? memberLabel(selectedMember) : query
          }
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
          aria-label="Search members by name, ID, email, or phone"
          aria-controls="member-search-results"
          className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-19 text-sm text-foreground outline-none transition-colors placeholder:text-muted hover:border-primary/40 hover:bg-accent/30 focus:border-primary focus:bg-card focus:ring-2 focus:ring-ring/30"
        />
        {open && query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-10 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted transition hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Clear member search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Toggle member list"
          aria-expanded={open}
          aria-controls="member-search-results"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open ? (
          <div
            id="member-search-results"
            className="absolute left-0 z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-lg"
          >
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
                        selected ? "bg-primary-soft" : "hover:bg-accent"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onSelect(member);
                          setOpen(false);
                          setQuery("");
                        }}
                        className="min-w-0 flex-1 rounded-xl px-2 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span className="block truncate text-sm font-semibold text-foreground">
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
                        aria-label={`Edit ${member.first_name} ${member.last_name}`}
                        onClick={() => onEdit(member)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-accent hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        title="Delete member"
                        aria-label={`Delete ${member.first_name} ${member.last_name}`}
                        onClick={() => onDelete(member)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                  className="rounded-full px-2 py-1 transition hover:bg-accent disabled:opacity-40"
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
                  className="rounded-full px-2 py-1 transition hover:bg-accent disabled:opacity-40"
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
        className="order-2 ml-auto inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-primary/25 bg-primary-soft px-3.5 text-sm font-semibold text-primary transition-colors hover:border-primary/45 hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card sm:order-0 sm:ml-0 sm:px-4"
        title="Add member"
      >
        <Plus className="h-4 w-4" />
        <span>Add Member</span>
      </button>
    </div>
  );
}
