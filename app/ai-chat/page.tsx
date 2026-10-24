import AIChat from "@/components/Aichat/AIChat";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AIChatPage() {
  return (
    <ProtectedRoute>
      <main className="h-dvh min-h-0 w-full overflow-hidden bg-background">
        <AIChat />
      </main>
    </ProtectedRoute>
  );
}
