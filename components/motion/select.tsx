"use client";

import React, {
  useEffect,
  useRef,
  useState,
  Children,
  isValidElement,
  ReactNode,
} from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type SelectProps = {
  id?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  name?: string;
  placeholder?: string;
};

type SelectOptionProps = {
  value?: string | number;
  children?: ReactNode;
  disabled?: boolean;
};

export default function Select({
  id,
  value = "",
  onChange,
  children,
  className = "",
  disabled = false,
  name,
  placeholder = "Select...",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const options = Children.toArray(children)
    .flatMap((child): React.ReactElement<SelectOptionProps>[] => {
      if (!isValidElement<SelectOptionProps>(child)) return [];

      if (child.type === React.Fragment) {
        return Children.toArray(child.props.children).filter(
          (nestedChild): nestedChild is React.ReactElement<SelectOptionProps> =>
            isValidElement<SelectOptionProps>(nestedChild),
        );
      }

      return [child];
    })
    .map((child) => ({
      value: String(child.props.value ?? ""),
      label: child.props.children,
      disabled: child.props.disabled ?? false,
    }));

  const selectedOption = options.find(
    (option) => option.value === String(value),
  );

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange?.({
      target: {
        name: name ?? "",
        value: optionValue,
      },
    } as React.ChangeEvent<HTMLSelectElement>);

    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Hidden native input for form compatibility */}
      <input type="hidden" id={id} name={name} value={value} readOnly />

      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(`
          form-field-trigger
          flex w-full items-center justify-between
          h-11
          rounded-xl border border-border
          bg-[#f7f8ff] px-3.5 dark:bg-background
          text-sm text-foreground
          transition-all duration-200
          outline-none
          hover:border-primary/40
          focus:border-primary
          focus:bg-white
          dark:focus:bg-background
          focus:ring-4 focus:ring-ring/40
          disabled:cursor-not-allowed
          disabled:bg-muted
          disabled:text-muted
        `, className)}
      >
        <span className={selectedOption ? "" : "text-slate-400"}>
          {selectedOption?.label ?? placeholder}
        </span>

        <ChevronDown
          size={18}
          className={`
            shrink-0 text-muted
            transition-transform duration-200
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* Custom Dropdown */}
      {open && !disabled && (
        <div
          className="
            absolute left-0 right-0 z-9999
            mt-2
            max-h-64
            overflow-y-auto
            rounded-xl
            border border-slate-200
            bg-white dark:border-border dark:bg-card
            p-1.5
            shadow-[0_16px_36px_rgba(15,23,42,0.16)]
          "
        >
          {options.map((option) => {
            const selected = String(value) === option.value;

            return (
              <button
                key={option.value}
                type="button"
                disabled={option.disabled}
                onClick={() => handleSelect(option.value)}
                className={`
                  flex w-full items-center justify-between
                  rounded-lg
                  px-3 py-2.5
                  text-left text-sm
                  transition-colors
                  ${
                    selected
                      ? "bg-primary-soft font-semibold text-primary"
                      : "text-foreground hover:bg-muted"
                  }
                  ${
                    option.disabled
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }
                `}
              >
                <span>{option.label}</span>

                {selected && (
                  <Check size={16} className="shrink-0 text-primary" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
