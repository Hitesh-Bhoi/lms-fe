"use client";
import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

// base layout wrapper props interface
interface BaseLayoutProps {
  children: React.ReactNode;
}

// main authenticated layout with responsive sidebar and topbar
export const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  // sidebar collapse and expand toggle state
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // toggle sidebar open and close state
  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* responsive sidebar navigation */}
      <Sidebar isOpen={isOpen} onToggle={handleToggle} />
      {/* main content container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* header navigation bar */}
        <Topbar isOpen={isOpen} onToggle={handleToggle} />
        {/* active route page content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};
