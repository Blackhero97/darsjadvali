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
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-100/40 to-indigo-100/40 border border-violet-200/60 group-focus-within:border-violet-400/80 group-focus-within:shadow-lg group-focus-within:shadow-violet-500/20 transition-all duration-300" />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-500 group-focus-within:text-violet-700 transition-colors duration-300" />
      <input
        autoFocus={autoFocus}
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="relative w-full h-12 pl-12 pr-11 bg-transparent text-violet-800 placeholder-violet-500/70 outline-none rounded-xl focus:ring-2 focus:ring-violet-500/40 transition-all duration-300"
      />
      {local && (
        <button
          type="button"
          onClick={() => {
            setLocal("");
            onChange?.("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-500 hover:text-violet-700 w-7 h-7 rounded-full flex items-center justify-center hover:bg-violet-200/60 transition-all duration-300 hover:scale-110"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export { SearchBar };
export default SearchBar;
