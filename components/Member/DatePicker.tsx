"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function parseDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.getFullYear() === Number(match[1]) &&
    date.getMonth() === Number(match[2]) - 1 &&
    date.getDate() === Number(match[3])
    ? date
    : null;
}

function toInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export default function DatePicker({
  name,
  value,
  onChange,
  className,
}: DatePickerProps) {
  const selectedDate = parseDate(value);
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() =>
    startOfMonth(selectedDate ?? new Date()),
  );
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const today = new Date();
  const firstWeekday = (visibleMonth.getDay() + 6) % 7;
  const calendarStart = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth(),
    1 - firstWeekday,
  );
  const calendarDays = Array.from({ length: 42 }, (_, index) =>
    new Date(
      calendarStart.getFullYear(),
      calendarStart.getMonth(),
      calendarStart.getDate() + index,
    ),
  );

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function selectDate(date: Date) {
    onChange({
      target: { name, value: toInputValue(date) },
    } as React.ChangeEvent<HTMLInputElement>);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function toggleCalendar() {
    if (!open) setVisibleMonth(startOfMonth(selectedDate ?? today));
    setOpen((current) => !current);
  }

  const displayValue = selectedDate
    ? selectedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Choose a date";

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input type="hidden" name={name} value={value} readOnly />
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Transaction date: ${displayValue}`}
        onClick={toggleCalendar}
        className={cn(
          "form-field-trigger flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-border bg-[#f7f8ff] px-3.5 text-left text-sm text-foreground outline-none transition-colors hover:border-primary/40 focus:border-primary focus:bg-white focus:ring-4 focus:ring-ring/40",
          className,
        )}
      >
        <span>{displayValue}</span>
        <CalendarDays className="h-4 w-4 shrink-0 text-muted" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose transaction date"
          className="absolute left-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-border bg-white p-3 shadow-xl"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() =>
                setVisibleMonth(
                  (month) => new Date(month.getFullYear(), month.getMonth() - 1, 1),
                )
              }
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-primary-soft hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <p className="text-sm font-semibold text-foreground">
              {visibleMonth.toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </p>
            <button
              type="button"
              aria-label="Next month"
              onClick={() =>
                setVisibleMonth(
                  (month) => new Date(month.getFullYear(), month.getMonth() + 1, 1),
                )
              }
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-primary-soft hover:text-primary"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 text-center">
            {weekDays.map((day) => (
              <span
                key={day}
                className="py-1.5 text-[11px] font-semibold text-muted"
              >
                {day}
              </span>
            ))}
            {calendarDays.map((date) => {
              const dateValue = toInputValue(date);
              const isSelected = dateValue === value;
              const isToday = dateValue === toInputValue(today);
              const isCurrentMonth = date.getMonth() === visibleMonth.getMonth();

              return (
                <button
                  key={dateValue}
                  type="button"
                  aria-label={date.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  aria-pressed={isSelected}
                  onClick={() => selectDate(date)}
                  className={cn(
                    "mx-auto flex aspect-square w-9 items-center justify-center rounded-lg text-xs transition-colors",
                    isSelected
                      ? "bg-primary font-semibold text-white"
                      : isCurrentMonth
                        ? "text-foreground hover:bg-primary-soft hover:text-primary"
                        : "text-muted/50 hover:bg-muted",
                    isToday && !isSelected && "ring-1 ring-primary/50",
                  )}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex justify-end border-t border-border pt-2">
            <button
              type="button"
              onClick={() => selectDate(today)}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary-soft"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}