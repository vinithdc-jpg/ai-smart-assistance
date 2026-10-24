import type { ChatMessage as ChatMessageType } from "./AIChat";

interface ChatMessageProps {
  message: ChatMessageType;
}

function renderInlineText(text: string) {
  const parts = text.split(/(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith("***") && part.endsWith("***")) {
      return <strong key={index} className="font-semibold text-foreground">{part.slice(3, -3)}</strong>;
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-xs text-primary"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

function isTableRow(line: string) {
  return line.trim().startsWith("|") && line.trim().endsWith("|");
}

function isTableSeparator(line: string) {
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line.trim());
}

function tableCells(line: string) {
  return line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => cell.trim());
}

function AssistantContent({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line) {
      index += 1;
      continue;
    }

    if (isTableRow(line) && index + 1 < lines.length && isTableSeparator(lines[index + 1])) {
      const headers = tableCells(line);
      const rows: string[][] = [];
      index += 2;

      while (index < lines.length && isTableRow(lines[index])) {
        rows.push(tableCells(lines[index]));
        index += 1;
      }

      blocks.push(
        <div key={`table-${index}`} className="my-3.5 overflow-x-auto rounded-xl border border-border bg-background/50">
          <table className="w-full min-w-max border-collapse text-left text-xs">
            <thead className="border-b border-border bg-primary-soft/50 text-[11px] font-semibold uppercase tracking-wider text-foreground">
              <tr>
                {headers.map((header, headerIndex) => (
                  <th key={headerIndex} className="px-3.5 py-2.5">
                    {renderInlineText(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="transition-colors hover:bg-white/2">
                  {headers.map((_, cellIndex) => (
                    <td key={cellIndex} className="px-3.5 py-2.5 align-top text-foreground/90">
                      {renderInlineText(row[cellIndex] || "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      blocks.push(
        <h3
          key={`heading-${index}`}
          className={`font-semibold text-foreground first:mt-0 ${
            level === 1 ? "mt-5 mb-2.5 text-base" : level === 2 ? "mt-4 mb-2 text-sm" : "mt-3 mb-1.5 text-xs uppercase tracking-wider text-primary"
          }`}
        >
          {renderInlineText(heading[2])}
        </h3>,
      );
      index += 1;
      continue;
    }

    if (/^[-*]\s+/.test(line) || /^\d+[.)]\s+/.test(line)) {
      const ordered = /^\d+[.)]\s+/.test(line);
      const items: string[] = [];

      while (index < lines.length) {
        const item = lines[index].trim();
        const match = ordered ? item.match(/^\d+[.)]\s+(.+)$/) : item.match(/^[-*]\s+(.+)$/);
        if (!match) break;
        items.push(match[1]);
        index += 1;
      }

      const List = ordered ? "ol" : "ul";
      blocks.push(
        <List key={`list-${index}`} className={`${ordered ? "list-decimal" : "list-disc"} my-2.5 space-y-1.5 pl-5 text-foreground/90`}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex} className="leading-relaxed">
              {renderInlineText(item)}
            </li>
          ))}
        </List>,
      );
      continue;
    }

    const paragraph: string[] = [line];
    index += 1;
    while (index < lines.length && lines[index].trim() && !/^#{1,3}\s+/.test(lines[index].trim())) {
      if (isTableRow(lines[index].trim()) || /^[-*]\s+/.test(lines[index].trim()) || /^\d+[.)]\s+/.test(lines[index].trim())) break;
      paragraph.push(lines[index].trim());
      index += 1;
    }

    blocks.push(
      <p key={`paragraph-${index}`} className="mb-2.5 text-foreground/90 last:mb-0 leading-relaxed">
        {paragraph.map((paragraphLine, lineIndex) => (
          <span key={lineIndex}>
            {lineIndex > 0 && <br />}
            {renderInlineText(paragraphLine)}
          </span>
        ))}
      </p>,
    );
  }

  return <div className="wrap-break-word text-sm leading-relaxed">{blocks}</div>;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-in fade-in duration-200`}>
      <div className={`flex flex-col ${isUser ? "items-end max-w-[85%] sm:max-w-[75%]" : "items-start w-full max-w-3xl"}`}>
        {/* Header Label / Avatar */}
        <div className="mb-1.5 flex items-center gap-2 px-1">
          {!isUser ? (
            <>
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-[10px] font-bold text-white shadow-[0_2px_8px_rgba(139,124,255,0.3)]">
                SL
              </div>
              <span className="text-xs font-semibold text-foreground/80">
                Smart Ledger AI
              </span>
            </>
          ) : (
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted">
              You
            </span>
          )}
        </div>

        {/* Message Bubble */}
        <div
          className={
            isUser
              ? "rounded-2xl rounded-tr-xs bg-primary px-4 py-3 text-sm text-white shadow-[0_4px_16px_rgba(139,124,255,0.25)] leading-relaxed"
              : "w-full rounded-2xl rounded-tl-xs border border-border bg-card p-4 sm:p-5 text-foreground shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
          }
        >
          {isUser ? (
            <p className="whitespace-pre-wrap wrap-break-word text-sm leading-relaxed">
              {message.content}
            </p>
          ) : (
            <AssistantContent content={message.content} />
          )}
        </div>
      </div>
    </div>
  );
}
