"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import apiRequest from "@/lib/api";
import { logoutUser } from "@/lib/authApi";
import BackNavigationLogoutGuard from "@/components/BackNavigationLogoutGuard";

export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  contextMemberId?: string;
}

interface TransactionChatResponse {
  success: boolean;
  question?: string;
  answer?: string;
  message?: string;
  contextMemberId?: string;
  member?: {
    id: string;
    memberId: string;
    name: string;
  } | null;
  sources?: {
    transactions: number;
    knowledge: number;
  };
}

export default function AIChat() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (messageText: string) => {
    const trimmedMessage = messageText.trim();
    if (!trimmedMessage || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmedMessage,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const history = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        contextMemberId: msg.contextMemberId,
      }));

      const data = await apiRequest<TransactionChatResponse>(
        "/ai/transaction-chat",
        {
          method: "POST",
          body: JSON.stringify({ message: trimmedMessage, history }),
        },
      );

      if (!data.success) throw new Error(data.message || "AI request failed");

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          data.answer || data.message || "I couldn't generate an answer.",
        contextMemberId: data.contextMemberId,
      };

      setMessages((previous) => [...previous, assistantMessage]);
    } catch (error) {
      console.error("AI transaction chat error:", error);

      const rawMsg = error instanceof Error ? error.message : "";
      const isCrossClubError =
        rawMsg.toLowerCase().includes("another club") ||
        rawMsg.toLowerCase().includes("cannot access") ||
        rawMsg.toLowerCase().includes("not accessible") ||
        rawMsg.toLowerCase().includes("access this club");

      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: isCrossClubError
          ? "🚫 You can't search another club's details. You can only access members and transactions that belong to your club."
          : rawMsg ||
            "Sorry, something went wrong while processing your request.",
      };

      setMessages((previous) => [...previous, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  async function handleLogout() {
    try {
      await logoutUser();
    } finally {
      router.replace("/login");
    }
  }

  function handleNewChat() {
    setMessages([]);
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-background text-foreground antialiased">
      <BackNavigationLogoutGuard loginPath="/login" logout={logoutUser} />
      <ChatHeader
        onLogout={handleLogout}
        ButtonName="Member Details"
        onNewChat={handleNewChat}
      />

      <ChatMessageList
        messages={messages}
        isLoading={isLoading}
        onSelectSuggestion={handleSendMessage}
      />
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
}
