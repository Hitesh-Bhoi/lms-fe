"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UsersIcon,
  PlusIcon,
  SettingsIcon,
  UserIcon,
  ChevronDownIcon,
} from "@/common/icon";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (pathname === "/profile") {
      setIsSettingsOpen(true);
    }
  }, [pathname]);

  const navItems = [
    {
      label: "Leads",
      href: "/",
      icon: UsersIcon,
      isActive: pathname === "/",
    },
    {
      label: "Add Lead",
      href: "/leads/add",
      icon: PlusIcon,
      isActive: pathname === "/leads/add",
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-white flex flex-col transition-all duration-300 ease-in-out overflow-hidden lg:h-screen lg:sticky lg:top-0 ${
          isOpen
            ? "w-64 translate-x-0 border-r border-slate-200/80"
            : "w-0 -translate-x-full border-r-0 lg:translate-x-0"
        }`}
      >
        <div className="w-64 shrink-0 flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-16 px-4 flex items-center border-b border-slate-200/80 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-linear-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-xs shrink-0">
                <UsersIcon className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-900 text-base tracking-tight whitespace-nowrap">
                LMS Portal
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (typeof window !== "undefined" && window.innerWidth < 1024) {
                      onToggle();
                    }
                  }}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                    item.isActive
                      ? "bg-indigo-50 text-indigo-600 font-semibold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Settings Dropdown at Bottom */}
          <div className="p-3 border-t border-slate-200/80 shrink-0">
            <button
              type="button"
              onClick={() => setIsSettingsOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <SettingsIcon className="w-5 h-5 shrink-0" />
                <span className="whitespace-nowrap">Settings</span>
              </div>
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform duration-200 ${
                  isSettingsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isSettingsOpen && (
              <div className="mt-1 space-y-1 pl-2">
                <Link
                  href="/profile"
                  onClick={() => {
                    if (typeof window !== "undefined" && window.innerWidth < 1024) {
                      onToggle();
                    }
                  }}
                  className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                    pathname === "/profile"
                      ? "bg-indigo-50 text-indigo-600 font-semibold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <UserIcon className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">Profile</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
