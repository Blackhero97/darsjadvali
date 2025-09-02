import clsx from "clsx";

const Input = ({
  label,
  type = "text",
  placeholder = "",
  value = "",
  onChange,
  error = "",
  required = false,
  className = "",
  icon: Icon,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-[var(--color-text)] dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-faint)]">
            <Icon size={20} />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={clsx(
            "w-full h-12 rounded-xl border-2 transition-all duration-300",
            "placeholder:text-[var(--color-text-faint)] dark:placeholder:text-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:scale-[1.02]",
            "glass backdrop-blur-sm",
            error
              ? "border-red-400 dark:border-red-500 bg-red-50/80 dark:bg-red-900/20"
              : "border-gray-300/50 dark:border-gray-600/50 hover:border-indigo-300 dark:hover:border-indigo-500",
            "text-[var(--color-text)] dark:text-white",
            Icon ? "pl-12 pr-4" : "px-4",
            className
          )}
          {...props}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <div className="w-1 h-1 bg-red-500 rounded-full"></div>
          {error}
        </div>
      )}
    </div>
  );
};

export default Input;
