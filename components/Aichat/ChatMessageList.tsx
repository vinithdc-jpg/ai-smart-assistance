"use client";

import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import type { ChatMessage as ChatMessageType } from "./AIChat";

interface ChatMessageListProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  onSelectSuggestion?: (text: string) => void;
}

const SUGGESTIONS = [
  {
    icon: "💳",
    title: "Overdue AMC Status",
    desc: "Which members currently have an overdue AMC status?",
  },
  {
    icon: "📊",
    title: "Pending Ledger Balances",
    desc: "List members with the highest pending balances",
  },
  {
    icon: "📄",
    title: "Payment Status Meanings",
    desc: "Explain the difference between partial and completed payments",
  },
  {
    icon: "🔍",
    title: "Transaction Search",
    desc: "Show recent membership and service transactions",
  },
];

export default function ChatMessageList({
  messages,
  isLoading,
  onSelectSuggestion,
}: ChatMessageListProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  return (
    <div
      ref={scrollRef}
      className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-6 sm:py-6 md:px-8 custom-scrollbar"
    >
      <div className="mx-auto w-full max-w-4xl space-y-5 sm:space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-5 text-center animate-in fade-in duration-300 sm:py-16">
            {/* Center Logo with Glow */}
            <div className="relative mb-4 sm:mb-6">
              <div className="absolute -inset-2 rounded-3xl bg-primary/20 blur-xl" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-white shadow-[0_10px_30px_rgba(37,99,235,0.24)] sm:h-16 sm:w-16 sm:rounded-3xl sm:text-2xl">
                SL
              </div>
            </div>

            <div className="mb-5 max-w-md space-y-1.5 sm:mb-8 sm:space-y-2">
              <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-2xl">
                How can I assist your club today?
              </h2>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Ask about ledger balances, AMC status, payments, or transactions.
              </p>
            </div>

            {/* Suggestion Cards */}
            <div className="grid w-full max-w-2xl grid-cols-1 gap-2.5 text-left sm:grid-cols-2 sm:gap-3">
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectSuggestion?.(s.desc)}
                  className="group flex flex-col justify-between rounded-xl border border-border bg-card/60 p-3 text-left transition-all duration-200 hover:border-primary/50 hover:bg-card hover:shadow-[0_8px_24px_rgba(37,99,235,0.12)] active:scale-[0.99] sm:p-4"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-base">{s.icon}</span>
                    <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                      {s.title}
                    </span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed line-clamp-2">
                    {s.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}

        {isLoading && (
          <div className="flex items-center gap-3 pt-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-[10px] font-bold text-white">
              SL
            </div>
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-xs border border-border bg-card px-4 py-3 text-xs text-muted shadow-sm">
              <span>Analyzing ledger data</span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
