import { useState } from "react";
import {
  Calendar,
  Users,
  BookOpen,
  Settings,
  Moon,
  Sun,
  X,
  Menu,
} from "lucide-react";
import { useDarkMode } from "../hooks";
import clsx from "clsx";
import Button from "./Button";
import Swal from "sweetalert2";

const Layout = ({ children, currentPage, onPageChange }) => {
  const [isDark, setIsDark] = useDarkMode();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Password protection function
  const handlePageChange = async (pageId) => {
    // Agar bosh sahifadan boshqa sahifaga o'tmoqchi bo'lsa
    if (currentPage === "dashboard" && pageId !== "dashboard") {
      const { value: password } = await Swal.fire({
        title: "🔐 Himoyalangan sahifa",
        input: "password",
        inputLabel: "Parolni kiriting:",
        inputPlaceholder: "Parol...",
        showCancelButton: true,
        confirmButtonText: "Kirish",
        cancelButtonText: "Bekor qilish",
        customClass: {
          popup: "rounded-2xl border-2 border-violet-200/50",
          title: "text-violet-700 font-bold",
          confirmButton:
            "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-xl",
          cancelButton:
            "bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded-xl",
        },
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        inputValidator: (value) => {
          if (!value) {
            return "Parol kiritish majburiy!";
          }
        },
      });

      if (password === "hero1997") {
        onPageChange(pageId);
      } else if (password) {
        Swal.fire({
          icon: "error",
          title: "❌ Noto'g'ri parol",
          text: "Iltimos, to'g'ri parolni kiriting",
          confirmButtonText: "Qaytadan urinish",
          customClass: {
            popup: "rounded-2xl border-2 border-red-200/50",
            confirmButton:
              "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-6 py-2 rounded-xl",
          },
          background: "linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)",
        });
      }
    } else {
      // Bosh sahifaga yoki bosh sahifadan bosh sahifaga o'tish - parol talab qilinmaydi
      onPageChange(pageId);
    }
  };

  const navigation = [
    {
      id: "dashboard",
      name: "Bosh sahifa",
      icon: Calendar,
      href: "#dashboard",
    },
    { id: "schedule", name: "Jadval", icon: Calendar, href: "#schedule" },
    { id: "teachers", name: "O'qituvchilar", icon: Users, href: "#teachers" },
    {
      id: "management",
      name: "Boshqaruv",
      icon: BookOpen,
      href: "#management",
    },
    { id: "settings", name: "Sozlamalar", icon: Settings, href: "#settings" },
  ];

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/15 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Perfect Light Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 z-50 h-full w-72 cyber-sidebar transform transition-all duration-500 ease-in-out lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Ultra Logo */}
          <div className="flex h-20 items-center justify-between px-6 border-b border-violet-200/30 ">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-cyber rounded-xl flex items-center justify-center pulse-neon">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">
                  Dars Jadvali
                </h1>
                <p className="text-xs text-perfect-accent font-medium">
                  v2.0 Perfect
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 text-perfect-dim hover:text-perfect-accent rounded-xl hover:bg-violet-50/60 "
            >
              <X size={20} />
            </button>
          </div>

          {/* Perfect Navigation */}
          <nav className="flex-1 space-y-2 p-5">
            {navigation.map((item, index) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    handlePageChange(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={clsx(
                    "w-full flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-300 group animate-slide-up",
                    isActive
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 scale-105"
                      : "text-violet-700/80 "
                  )}
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <item.icon
                    className={clsx(
                      "mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                      isActive
                        ? "text-white"
                        : "text-violet-600/70 "
                    )}
                  />
                  {item.name}
                  {isActive && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-white shadow-lg animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Perfect Light Mode Toggle */}
          <div className="p-5 border-t border-violet-100/60 ">
            <div className="glass-ultra p-4 rounded-2xl border border-violet-100/60 ">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-perfect">
                  {isDark ? "Dark Mode" : "Light Mode"}
                </span>
                <button
                  onClick={() => setIsDark(!isDark)}
                  className="w-12 h-6 rounded-full bg-violet-100 "
                >
                  <div
                    className={clsx(
                      "w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-300 transform flex items-center justify-center",
                      isDark
                        ? "translate-x-6 bg-violet-400"
                        : "translate-x-0.5 bg-violet-50"
                    )}
                  >
                    {isDark ? (
                      <Moon size={12} className="text-violet-900" />
                    ) : (
                      <Sun size={12} className="text-violet-600" />
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Perfect Main content */}
      <div className="lg:pl-72">
        {/* Perfect Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-x-4 glass-ultra border-b border-violet-100/80 ">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 text-perfect-dim hover:text-perfect-accent rounded-xl hover:bg-violet-50/60 transition-all duration-300 hover:scale-110"
          >
            <Menu size={20} />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">
                {navigation.find((item) => item.id === currentPage)?.name ||
                  "Dars Jadvali"}
              </h2>
            </div>

            {/* Right side decorative elements */}
            <div className="ml-auto flex items-center space-x-4">
              <div className="hidden md:flex space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full pulse-slow"></div>
                <div
                  className="w-2 h-2 bg-blue-400 rounded-full pulse-slow"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-purple-400 rounded-full pulse-slow"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="py-8">
          <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8 animate-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
