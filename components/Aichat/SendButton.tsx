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
      className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background transition-all hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-ring/50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45"
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
          d="M12 19V5m-7 7 7-7 7 7"
        />
      </svg>
    </button>
  );
}
