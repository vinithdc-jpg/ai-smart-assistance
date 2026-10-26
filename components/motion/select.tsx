"use client";

import React, {
  useEffect,
  useRef,
  useState,
  Children,
  isValidElement,
  ReactNode,
} from "react";
import { ChevronsUpDown, Check } from "lucide-react";
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
        className={cn(
          className,
          "form-field-trigger flex h-10 w-full items-center justify-between rounded-xl border border-[#333] bg-[#1b1b1b] px-3.5 text-sm text-[#f5f5f5] outline-none transition-colors hover:border-[#484848] focus-visible:border-[#555] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#333] dark:bg-[#1b1b1b] dark:text-[#f5f5f5]",
        )}
      >
        <span className={selectedOption ? "" : "text-[#a1a1a1]"}>
          {selectedOption?.label ?? placeholder}
        </span>

        <ChevronsUpDown size={16} className="shrink-0 text-[#c4c4c4]" />
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
            border border-[#303030]
            bg-[#1c1c1c]
            p-1.5
            shadow-[0_16px_36px_rgba(0,0,0,0.45)]
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
                  flex w-full items-center justify-start gap-3
                  rounded-lg
                  px-2.5 py-1.5
                  text-left text-sm
                  transition-colors
                  ${
                    selected
                      ? "font-semibold text-[#f5f5f5]"
                      : "text-[#e5e5e5] hover:bg-[#2a2a2a]"
                  }
                  ${
                    option.disabled
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }
                `}
              >
                <Check
                  size={16}
                  className={`shrink-0 ${selected ? "opacity-100" : "opacity-0"}`}
                />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
