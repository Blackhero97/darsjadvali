import clsx from "clsx";

const Select = ({
  label,
  value = "",
  onChange,
  options = [],
  placeholder = "Tanlang...",
  error = "",
  required = false,
  className = "",
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

      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={clsx(
          "w-full h-12 px-4 py-3 rounded-xl border-2 transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:scale-[1.02]",
          "glass backdrop-blur-sm cursor-pointer",
          error
            ? "border-red-400 dark:border-red-500 bg-red-50/80 dark:bg-red-900/20"
            : "border-gray-300/50 dark:border-gray-600/50 hover:border-indigo-300 dark:hover:border-indigo-500",
          "text-[var(--color-text)] dark:text-white",
          "appearance-none bg-no-repeat bg-right bg-[length:16px]",
          "bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M4%206L8%2010L12%206%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] pr-12",
          className
        )}
        {...props}
      >
        <option value="" disabled className="text-[var(--color-text-faint)]">
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="py-2 text-[var(--color-text)] dark:text-white bg-[var(--color-surface)] dark:bg-gray-800"
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <div className="w-1 h-1 bg-red-500 rounded-full"></div>
          {error}
        </div>
      )}
    </div>
  );
};

export default Select;
