"use client";

import React, { useEffect } from "react";

export type PopMessageType = "success" | "error" | "warning" | "info";

export interface PopMessageProps {
  message: string | null;
  type?: PopMessageType;
  title?: string;
  duration?: number;
  onClose: () => void;
}

export default function PopMessage({
  message,
  type = "info",
  title,
  duration = 4000,
  onClose,
}: PopMessageProps) {
  useEffect(() => {
    if (!message) return;

    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === "success";
  const isError = type === "error";
  const isWarning = type === "warning";

  const defaultTitle = isSuccess
    ? "Success"
    : isError
      ? "Error"
      : isWarning
        ? "Warning"
        : "Notice";

  return (
    <div className="fixed top-5 right-5 z-[110] max-w-sm w-full animate-in fade-in slide-in-from-top-4 duration-200">
      <div
        className={`flex items-start gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur-md transition-all ${
          isSuccess
            ? "border-emerald-500/30 bg-emerald-950/85 text-emerald-100"
            : isError
              ? "border-red-500/30 bg-red-950/85 text-red-100"
              : isWarning
                ? "border-amber-500/30 bg-amber-950/85 text-amber-100"
                : "border-primary/30 bg-card/95 text-foreground"
        }`}
      >
        {/* Icon */}
        <div className="shrink-0 pt-0.5">
          {isSuccess ? (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : isError ? (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          ) : isWarning ? (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
        </div>

        {/* Message body */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold tracking-wide uppercase opacity-90">
            {title || defaultTitle}
          </p>
          <p className="mt-0.5 text-xs sm:text-sm leading-snug break-words">
            {message}
          </p>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 -mr-1 -mt-1 cursor-pointer rounded-lg p-1.5 opacity-60 hover:opacity-100 transition-opacity hover:bg-black/20"
          aria-label="Close"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
