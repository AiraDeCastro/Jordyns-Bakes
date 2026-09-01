export function CakeIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M58 18v10" stroke="var(--accent-deep)" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M58 10c-3 3-3 5 0 8s3 5 0 8"
        stroke="var(--accent-deep)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="22"
        y="52"
        width="76"
        height="26"
        rx="6"
        fill="var(--accent-tint)"
        stroke="var(--accent-deep)"
        strokeWidth="3"
      />
      <rect
        x="30"
        y="82"
        width="60"
        height="26"
        rx="6"
        fill="var(--surface)"
        stroke="var(--accent-deep)"
        strokeWidth="3"
      />
      <path
        d="M22 52c0-8 8-14 18-14h36c10 0 18 6 18 14"
        stroke="var(--accent-deep)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
