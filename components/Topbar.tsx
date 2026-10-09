"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MenuIcon, UserIcon, LogoutIcon } from "@/common/icon";
import { logoutAdmin } from "@/libs/Apis";

interface TopbarProps {
  isOpen: boolean;
  onToggle: () => void;
}
const getPageTitle = (pathname: string): string => {
  if (pathname === "/" || pathname === "/leads") return "Leads";
  if (pathname === "/leads/add") return "Add Lead";
  if (pathname === "/profile") return "Profile";
  if (pathname.startsWith("/leads/")) {
    if (pathname.endsWith("/edit")) return "Edit Lead";
    return "Lead Details";
  }
  return "Leads";
};

export const Topbar: React.FC<TopbarProps> = ({ isOpen, onToggle }) => {
  const pathname = usePathname();
  const router = useRouter();
  const pageTitle = getPageTitle(pathname);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // close the profile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // admin logout
  const handleLogoutAdmin = async () => {
    setIsProfileMenuOpen(false);
    try {
      await logoutAdmin();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shrink-0">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggle}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          title={isOpen ? "Turn off sidebar" : "Turn on sidebar"}
          aria-label="Toggle sidebar"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
        <span className="text-base font-semibold text-slate-900 tracking-tight">
          {pageTitle}
        </span>
      </div>

      {/* profile menu */}
      <div className="relative" ref={profileMenuRef}>
        <button
          type="button"
          onClick={() => setIsProfileMenuOpen((prev) => !prev)}
          className="w-10 h-10 rounded-full bg-linear-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-xs hover:ring-2 hover:ring-indigo-500/20 transition-all cursor-pointer"
          title="Profile menu"
          aria-label="Profile menu"
        >
          <UserIcon className="w-5 h-5" />
        </button>

        {isProfileMenuOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-200/80 py-1.5 z-30">
            <Link
              href="/profile"
              onClick={() => setIsProfileMenuOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
            >
              <UserIcon className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Profile</span>
            </Link>
            <button
              type="button"
              onClick={handleLogoutAdmin}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
            >
              <LogoutIcon className="w-4 h-4 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
