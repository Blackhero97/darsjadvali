const Card = ({
  children,
  className = "",
  hover = false,
  onClick,
  gradient = false,
  glow = false,
  compact = false,
  interactive = true,
  variant = "default", // default | alt | glass | neon
  ...props
}) => {
  const base = "transition-all duration-300 ease-out rounded-[var(--radius)]";
  const variants = {
    default:
      "panel bg-[var(--color-surface-alt)] ",
    alt: "panel bg-[var(--color-surface-alt)]",
    glass: "glass-ultra",
    neon: "neon-card shadow-[var(--shadow-strong)]",
  };

  const bg = gradient
    ? "gradient-cyber text-white"
    : variants[variant] || variants.default;
  const shadow = glow ? "shadow-glow" : "shadow-soft";
  const border =
    gradient || variant === "glass" || variant === "neon"
      ? "border border-transparent"
      : "border border-[var(--color-border)] ";
  const hoverFx = hover || interactive ? "hover-lift cursor-pointer" : "";
  const padding = compact ? "p-3 md:p-4" : "p-4 md:p-6";

  return (
    <div
      className={`${base} ${bg} ${shadow} ${border} ${hoverFx} ${padding} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      {...props}
    >
      <div className="relative">{children}</div>
    </div>
  );
};

export default Card;
