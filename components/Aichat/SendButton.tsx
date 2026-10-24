"use client";

interface SendButtonProps {
  disabled?: boolean;
}

export default function SendButton({ disabled = false }: SendButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      aria-label="Send message"
      className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-primary text-white shadow-[0_4px_14px_rgba(139,124,255,0.35)] transition-all hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-ring/50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <svg
        className="h-4 w-4 transform transition-transform"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 12h14M12 5l7 7-7 7"
        />
      </svg>
    </button>
  );
}
