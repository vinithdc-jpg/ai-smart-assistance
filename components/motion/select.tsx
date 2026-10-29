"use client";

import React, {
  useEffect,
  useRef,
  useState,
  Children,
  isValidElement,
  ReactNode,
  type CSSProperties,
} from "react";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";

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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>();

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
        !wrapperRef.current.contains(event.target as Node) &&
        !dropdownRef.current?.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const updateDropdownPosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const bounds = trigger.getBoundingClientRect();
      const spaceBelow = window.innerHeight - bounds.bottom - 8;
      const spaceAbove = bounds.top - 8;
      const placeBelow = spaceBelow >= 160 || spaceBelow >= spaceAbove;
      const availableSpace = Math.max(
        0,
        Math.min(256, placeBelow ? spaceBelow : spaceAbove),
      );

      setDropdownStyle({
        position: "fixed",
        left: bounds.left,
        width: bounds.width,
        maxHeight: availableSpace,
        ...(placeBelow
          ? { top: bounds.bottom + 8 }
          : { bottom: window.innerHeight - bounds.top + 8 }),
      });
    };

    updateDropdownPosition();
    window.addEventListener("resize", updateDropdownPosition);
    window.addEventListener("scroll", updateDropdownPosition, true);

    return () => {
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition, true);
    };
  }, [open]);

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
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          className,
          "form-field-trigger flex h-10 w-full items-center justify-between rounded-xl border border-border bg-background px-3.5 text-sm text-foreground outline-none transition-colors hover:border-primary/40 focus-visible:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        <span className={selectedOption ? "" : "text-muted-foreground"}>
          {selectedOption?.label ?? placeholder}
        </span>

        <ChevronsUpDown size={16} className="shrink-0 text-muted-foreground" />
      </button>

      {/* Custom Dropdown */}
      {open &&
        !disabled &&
        dropdownStyle &&
        createPortal(
          <div
            ref={dropdownRef}
            role="listbox"
            className="
            z-[9999]
            overflow-y-auto
            rounded-xl
            border border-border
            bg-popover text-popover-foreground
            p-1.5
            shadow-lg
          "
            style={dropdownStyle}
          >
            {options.map((option) => {
              const selected = String(value) === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={selected}
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
                      ? "bg-primary-soft font-semibold text-primary"
                      : "text-popover-foreground hover:bg-accent hover:text-accent-foreground"
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
                    className={`h-4 w-4 shrink-0 ${selected ? "opacity-100" : "opacity-0"}`}
                  />
                  <span className="min-w-0 flex-1 text-left">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}
