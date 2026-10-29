"use client";

import Select from "@/components/motion/select";

export type MemberFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  memberId: string;
  pendingAmount: string; // only used in edit mode
  amcStatus: string;
};

interface MemberFormProps {
  form: MemberFormState;
  editing: boolean;
  loading: boolean;
  error: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

const baseInput =
  "h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-foreground outline-none transition-all " +
  "placeholder:text-muted/50 focus:border-primary focus:bg-white focus:ring-4 focus:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50";

function Field({
  label,
  required,
  hint,
  floating = false,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  floating?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      className={
        floating
          ? "form-floating-field"
          : "flex flex-col gap-1.5"
      }
    >
      <span
        className={`${floating ? "form-floating-label" : "flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted"}`}
      >
        {label}
        {required && <span className="text-red-400">*</span>}
      </span>
      {children}
      {hint && <span className="text-[11px] text-muted/70">{hint}</span>}
    </label>
  );
}

export default function MemberForm({
  form,
  editing,
  loading,
  error,
  onChange,
  onSubmit,
  onCancel,
}: MemberFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-border bg-white p-4 shadow-[0_12px_40px_rgba(31,35,80,0.07)] sm:p-6"
    >
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            {editing ? "Edit member" : "Add member"}
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            {editing
              ? "Update the member's information below."
              : "Fill in the details — the Member ID will be assigned automatically."}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {/* Auto-assigned badge (create) or member ID pill (edit) */}
          {editing ? (
            <span className="flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
              <svg
                width="11"
                height="11"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
                  clipRule="evenodd"
                />
              </svg>
              {form.memberId}
            </span>
          ) : (
            <span className="rounded-full border border-border bg-[#f7f8ff] px-3 py-1 text-xs text-muted">
              ID auto-assigned
            </span>
          )}
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-[#f7f8ff] hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Fields grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="First name" required floating>
          <input
            required
            name="firstName"
            type="text"
            placeholder=" "
            value={form.firstName}
            onChange={onChange}
            className={`${baseInput} form-floating-input`}
          />
        </Field>

        <Field label="Last name" required floating>
          <input
            required
            name="lastName"
            type="text"
            placeholder=" "
            value={form.lastName}
            onChange={onChange}
            className={`${baseInput} form-floating-input`}
          />
        </Field>

        <Field label="Email" required floating>
          <input
            required
            name="email"
            type="email"
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
            placeholder=" "
            value={form.email}
            onChange={onChange}
            className={`${baseInput} form-floating-input`}
          />
        </Field>

        <Field label="Phone" hint="Digits only" floating>
          <input
            name="phone"
            type="tel"
            placeholder=" "
            value={form.phone}
            maxLength={15}
            onChange={(e) => {
              const syntheticEvent = {
                ...e,
                target: {
                  ...e.target,
                  name: "phone",
                  value: e.target.value.replace(/\D/g, ""),
                },
              } as React.ChangeEvent<HTMLInputElement>;
              onChange(syntheticEvent);
            }}
            className={`${baseInput} form-floating-input`}
          />
        </Field>

        {/* Pending amount — edit mode only */}
        {editing && (
          <Field label="Pending amount" floating>
            <input
              name="pendingAmount"
              type="number"
              min="0"
              step="0.01"
              placeholder=" "
              value={form.pendingAmount}
              onChange={onChange}
              onWheel={(e) => e.currentTarget.blur()}
              className={`${baseInput} form-floating-input`}
            />{" "}
          </Field>
        )}

        <Field label="Status" required>
          <Select
            name="amcStatus"
            value={form.amcStatus}
            onChange={onChange}
            className="h-11"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </Field>
      </div>

      {/* Error */}
      {error && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(93,95,239,0.22)] transition hover:bg-primary-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving…" : editing ? "Save changes" : "Add member"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:border-primary/40 hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
