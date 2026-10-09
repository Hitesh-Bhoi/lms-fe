"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BaseLayout } from "./BaseLayout";
import { getAdminProfile } from "@/libs/Apis";
import { AxiosInterceptor } from "../intercepters/AxiosInterceptor";

interface AppLayoutWrapperProps {
  children: React.ReactNode;
}

export const AppLayoutWrapper: React.FC<AppLayoutWrapperProps> = ({
  children,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // check user authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getAdminProfile();
        setIsAuthenticated(true);
        if (pathname === "/login") {
          router.push("/");
        }
      } catch {
        setIsAuthenticated(false);
        if (pathname !== "/login") {
          router.push("/login");
        }
      }
    };
    checkAuth();
  }, [pathname, router]);

  // prevent hydration mismatch
  if (isAuthenticated === null) {
    return null;
  }

  if (pathname === "/login") {
    return <AxiosInterceptor>{children}</AxiosInterceptor>;
  }

  // prevent flashing protected content before redirect takes effect
  if (!isAuthenticated) {
    return null;
  }

  return (
    <AxiosInterceptor>
      <BaseLayout>{children}</BaseLayout>
    </AxiosInterceptor>
  );
};
