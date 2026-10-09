"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// axios interceptor provider props interface
interface AxiosInterceptorProps {
  children: React.ReactNode;
}

// component that sets up global axios request and response interceptors
export const AxiosInterceptor: React.FC<AxiosInterceptorProps> = ({
  children,
}) => {
  // router instance for redirecting unauthenticated users
  const router = useRouter();
  // state indicating whether interceptors have been registered
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  // ref to track pending redirect timeout for 401 response
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isMounted = true;

    // request interceptor to attach the token
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("admin_token");
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // response interceptor to handle 401 errors globally
    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        // clear any pending redirect if authentication / request succeeds
        if (redirectTimeoutRef.current) {
          clearTimeout(redirectTimeoutRef.current);
          redirectTimeoutRef.current = null;
        }
        return response;
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          const isLoginRequest = error.config?.url?.includes("/auth/login");
          if (!isLoginRequest) {
            localStorage.removeItem("admin_token");
            if (typeof window !== "undefined" && window.location.pathname !== "/login") {
              if (redirectTimeoutRef.current) {
                clearTimeout(redirectTimeoutRef.current);
              }
              redirectTimeoutRef.current = setTimeout(() => {
                router.push("/login");
              }, 1500);
            }
          }
        }
        return Promise.reject(error);
      },
    );

    queueMicrotask(() => {
      if (isMounted) {
        setIsInitialized(true);
      }
    });

    return () => {
      isMounted = false;
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
        redirectTimeoutRef.current = null;
      }
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [router]);

  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
};
