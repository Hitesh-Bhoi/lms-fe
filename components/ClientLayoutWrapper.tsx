"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { BaseLayout } from "./BaseLayout";

interface AppLayoutWrapperProps {
  children: React.ReactNode;
}

export const AppLayoutWrapper: React.FC<AppLayoutWrapperProps> = ({ children }) => {
  const pathname = usePathname();
  if (pathname === "/login") {
    return <>{children}</>;
  }
  return <BaseLayout>{children}</BaseLayout>;
};
