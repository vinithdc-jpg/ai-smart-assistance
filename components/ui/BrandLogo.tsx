import Image from "next/image";

export default function BrandLogo({
  className = "w-32",
}: {
  className?: string;
}) {
  return (
    <span
      className={`brand-logo max-w-full shrink-0 ${className}`}
      role="img"
      aria-label="Smart Ledger AI Assistant"
    >
      <Image
        src="/screen.png"
        alt=""
        aria-hidden="true"
        width={400}
        height={105}
        sizes="(max-width: 640px) 128px, 160px"
        className="brand-logo-light"
        priority
      />
      <Image
        src="/screen-dark.png"
        alt=""
        aria-hidden="true"
        width={400}
        height={105}
        sizes="(max-width: 640px) 128px, 160px"
        className="brand-logo-dark"
        priority
      />
    </span>
  );
}