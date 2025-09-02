import clsx from "clsx";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  loading = false,
  glow = false,
  pill = false,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium select-none whitespace-nowrap transition-all duration-300 focus:outline-none active:scale-[.97] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden";
  const radii = pill ? "rounded-full" : "rounded-[var(--radius-sm)]";

  const variantMap = {
    primary:
      "bg-[var(--color-accent)] text-[var(--color-accent-contrast)] hover:bg-[var(--color-accent-alt)] shadow-soft focus-visible:focus-outline",
    secondary:
      "bg-[var(--color-surface-alt)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-surface-alt)]/80 focus-visible:focus-outline",
    subtle:
      "bg-[var(--color-surface-alt)] text-[var(--color-text)] hover:bg-[var(--color-surface-alt)]/80 focus-visible:focus-outline",
    outline:
      "border border-[var(--color-border)] text-[var(--color-text)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)] focus-visible:focus-outline",
    ghost:
      "text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-alt)]/60 focus-visible:focus-outline",
    danger:
      "bg-[var(--color-danger)] text-white hover:brightness-110 focus-visible:focus-outline",
    success:
      "bg-[var(--color-success)] text-white hover:brightness-110 focus-visible:focus-outline",
  };

  const sizeMap = {
    sm: "h-9 px-4 text-sm gap-2",
    md: "h-11 px-5 text-sm gap-2",
    lg: "h-13 px-7 text-base gap-2",
  };

  const glowCls = glow ? "shadow-glow" : "";

  return (
    <button
      className={clsx(
        base,
        radii,
        variantMap[variant] || variantMap.primary,
        sizeMap[size],
        glowCls,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default Button;
