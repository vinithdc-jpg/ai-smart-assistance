"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import SendButton from "./SendButton";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({
  onSend,
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
  }, [message]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled) {
      return;
    }

    onSend(trimmedMessage);
    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <footer className="z-30 w-full shrink-0 border-t border-border/60 bg-background/90 px-3 py-2.5 backdrop-blur-md sm:px-6 sm:py-3 md:px-8">
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-4xl">
        <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-200 focus-within:border-primary focus-within:ring-4 focus-within:ring-ring/40 sm:rounded-2xl">
          <textarea
            ref={textareaRef}
            className="w-full max-h-40 min-h-12 resize-none bg-transparent px-3.5 pt-3 pb-2 text-sm leading-relaxed text-foreground placeholder:text-muted/60 outline-none sm:min-h-13 sm:px-4 sm:pt-3.5"
            placeholder="Ask anything about members, transactions, AMC status..."
            id="ai-input"
            rows={1}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
          />

          <div className="flex items-center justify-between border-t border-border/40 bg-card/90 px-3 py-2">
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <span className="hidden sm:inline-block text-[11px]">
                Press{" "}
                <kbd className="rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-foreground">
                  Enter
                </kbd>{" "}
                to send,{" "}
                <kbd className="rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-foreground">
                  Shift + Enter
                </kbd>{" "}
                for new line
              </span>
            </div>

            <SendButton disabled={disabled || !message.trim()} />
          </div>
        </div>
      </form>

      <p className="mx-auto mt-1.5 hidden max-w-4xl text-center text-[11px] text-muted sm:mt-2 sm:block">
        Smart Ledger AI assists with ledger calculations and club policy information.
      </p>
    </footer>
  );
}
