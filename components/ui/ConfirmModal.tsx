"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Trash2, AlertTriangle, LogOut, Loader2 } from "lucide-react";

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "primary" | "logout";
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isLoading, onClose]);

  if (!mounted || !isOpen) return null;

  const variantStyles = {
    danger: {
      icon: <Trash2 className="h-5 w-5 text-red-600" />,
      badge: "bg-red-50 ring-red-100",
      confirmBtn: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-400",
    },
    warning: {
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      badge: "bg-amber-50 ring-amber-100",
      confirmBtn:
        "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-400",
    },
    logout: {
      icon: <LogOut className="h-5 w-5 text-red-600" />,
      badge: "bg-red-50 ring-red-100",
      confirmBtn: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-400",
    },
    primary: {
      icon: <LogOut className="h-5 w-5 text-primary" />,
      badge: "bg-primary-soft ring-primary/20",
      confirmBtn:
        "bg-primary text-white hover:bg-primary-hover focus-visible:ring-ring",
    },
  }[variant];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-description"
      className="fixed inset-0 z-200 flex items-center justify-center p-4 sm:p-6"
    >
      <button
        type="button"
        aria-label="Close dialog"
        disabled={isLoading}
        onClick={isLoading ? undefined : onClose}
        className="modal-backdrop-in absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]"
      />

      <div className="modal-card-in relative z-10 w-full max-w-105 rounded-2xl border border-border bg-white p-5 shadow-[0_24px_80px_rgba(19,22,42,0.18)] sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${variantStyles.badge}`}
          >
            {variantStyles.icon}
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <h3
              id="confirm-modal-title"
              className="text-base font-semibold tracking-tight text-foreground sm:text-lg"
            >
              {title}
            </h3>
            <p
              id="confirm-modal-description"
              className="mt-1.5 text-sm leading-relaxed text-muted"
            >
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-2.5">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-border bg-white px-4 text-sm font-medium text-foreground transition hover:bg-[#f6f7ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 sm:w-auto"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => void onConfirm()}
            className={`inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-2 active:scale-[0.98] disabled:opacity-50 sm:w-auto ${variantStyles.confirmBtn}`}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
