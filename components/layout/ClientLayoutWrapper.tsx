"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BaseLayout } from "./BaseLayout";
import { getAdminProfile } from "@/libs/Apis";

// client layout wrapper props interface
interface AppLayoutWrapperProps {
  children: React.ReactNode;
}

// client-side authentication and layout wrapper component
export const AppLayoutWrapper: React.FC<AppLayoutWrapperProps> = ({
  children,
}) => {
  // get current route pathname
  const pathname = usePathname();
  // router instance for redirects
  const router = useRouter();
  // user authentication state (null: initial check pending, true: authenticated, false: unauthenticated)
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

    if (isAuthenticated === null) {
      checkAuth();
    } else if (isAuthenticated && pathname === "/login") {
      checkAuth();
    } else if (!isAuthenticated && pathname !== "/login") {
      checkAuth();
    }
  }, [pathname, router, isAuthenticated]);

  // prevent hydration mismatch
  if (isAuthenticated === null) {
    return null;
  }

  if (pathname === "/login") {
    return <>{children}</>;
  }

  // prevent flashing protected content before redirect takes effect
  if (!isAuthenticated) {
    return null;
  }

  return <BaseLayout>{children}</BaseLayout>;
};
