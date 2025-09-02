import { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import clsx from "clsx";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 modal-backdrop" onClick={onClose} />

      {/* Modal */}
      <div
        className={clsx(
          "relative w-full",
          sizeClasses[size],
          "modal-content",
          "rounded-3xl shadow-2xl",
          "max-h-[90vh] overflow-hidden",
          "animate-in duration-500 transform-gpu"
        )}
        style={{
          animation: "animate-in 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            {title && (
              <h2 className="text-2xl font-bold text-gradient-primary">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-3 text-[var(--color-text-faint)] hover:text-[var(--color-text)] rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:rotate-90"
              >
                <X size={24} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-theme(spacing.24))] scrollbar-thin">
          <div className="animate-in" style={{ animationDelay: "0.1s" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
