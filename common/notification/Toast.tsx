"use client";

import React, { useEffect } from "react";
import { SuccessIcon, ErrorIcon, CloseIcon } from "../icon";

export interface ToastPropsType {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastPropsType> = ({
  message,
  type = "success",
  onClose,
  duration = 3500,
}) => {

  // close notification after duration
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all animate-bounce bg-white border-slate-200">
      {type === "success" ? (
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <SuccessIcon className="w-4 h-4" />
        </span>
      ) : (
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <ErrorIcon className="w-4 h-4" />
        </span>
      )}
      <span className="text-slate-800">{message}</span>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 ml-2 p-0.5 rounded hover:bg-slate-100 transition-colors"
        title="Close notification"
      >
        <CloseIcon className="w-4 h-4" />
      </button>
    </div>
  );
};
