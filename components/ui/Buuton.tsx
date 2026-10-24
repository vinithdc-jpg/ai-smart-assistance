interface ButtonProms {
  ButtonName: string;
}

export default function ManageButton({ ButtonName }: ButtonProms) {
  return (
    <button
      type="button"
      aria-label="View member details"
      className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary-soft px-3.5 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
    >
      <span>{ButtonName} </span>
    </button>
  );
}
