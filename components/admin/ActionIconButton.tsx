import { Ban, Pencil } from "lucide-react";

export function ActionIconButton({
  onClick,
  src,
  alt,
  title,
  disabled = false,
}: {
  onClick: () => void;
  src?: string;
  alt: string;
  title: string;
  disabled?: boolean;
}) {
  const isEdit =
    /edit/i.test(title) || /edit/i.test(alt) || src?.includes("edit");

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white text-muted transition hover:border-primary hover:bg-primary-soft hover:text-primary"
      aria-label={title}
    >
      {isEdit ? <Pencil className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
    </button>
  );
}
