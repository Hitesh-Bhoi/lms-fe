"use client";
import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface BaseLayoutProps {
  children: React.ReactNode;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar with toggle */}
      <Sidebar isOpen={isOpen} onToggle={handleToggle} />
      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <Topbar isOpen={isOpen} onToggle={handleToggle} />
        {/* Page content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};
