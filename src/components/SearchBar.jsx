import { X, Search } from "lucide-react";
import clsx from "clsx";
import { useState, useEffect } from "react";

const SearchBar = ({
  value,
  onChange,
  placeholder = "Qidirish...",
  className = "",
  autoFocus = false,
}) => {
  const [local, setLocal] = useState(value || "");

  // Sync outside changes
  useEffect(() => {
    setLocal(value || "");
  }, [value]);

  // Debounce emit
  useEffect(() => {
    const id = setTimeout(() => onChange?.(local), 180);
    return () => clearTimeout(id);
  }, [local]);

  return (
    <div className={clsx("relative group", className)}>
      <div className="absolute inset-0 rounded-xl glass-ultra border border-violet-100/80 " />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-perfect-dim group-focus-within:text-perfect-accent transition-colors duration-300" />
      <input
        autoFocus={autoFocus}
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="relative w-full h-12 pl-12 pr-11 bg-transparent text-perfect placeholder-perfect-dim outline-none rounded-xl focus:ring-2 focus:ring-violet-400/30 "
      />
      {local && (
        <button
          type="button"
          onClick={() => {
            setLocal("");
            onChange?.("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-perfect-dim hover:text-perfect w-7 h-7 rounded-full flex items-center justify-center hover:bg-violet-50/60 "
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export { SearchBar };
export default SearchBar;
