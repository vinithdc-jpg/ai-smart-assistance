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
  const [effort, setEffort] = useState("Medium");
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
    <footer className="z-30 w-full shrink-0 bg-background/90 px-3 py-3 backdrop-blur-md sm:px-6 sm:py-4 md:px-8">
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-4xl">
        <div className="chat-composer rounded-[1.5rem] border border-border bg-card p-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-200 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-ring/20 sm:p-4">
          <textarea
            ref={textareaRef}
            className="chat-composer-input"
            placeholder="Ask anything about members, transactions, AMC status..."
            id="ai-input"
            rows={1}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
          />

          <div className="chat-composer-toolbar">
            <label className="chat-composer-effort">
              <span className="chat-composer-effort-icon" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <select
                aria-label="Response effort"
                value={effort}
                onChange={(event) => setEffort(event.target.value)}
                disabled={disabled}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>

            <SendButton disabled={disabled || !message.trim()} />
          </div>
        </div>
      </form>

      <p className="mx-auto mt-2 hidden max-w-4xl text-center text-[11px] text-muted sm:block">
        Press Enter to send, or Shift + Enter for a new line.
      </p>
    </footer>
  );
}
