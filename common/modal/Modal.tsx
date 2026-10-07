"use client";
import React from "react";
import { CloseIcon } from "../icon";


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  icon,
  children,
  maxWidth = "max-w-md",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`bg-white rounded-2xl border border-slate-200/90 shadow-2xl w-full ${maxWidth} overflow-hidden transform transition-all animate-in zoom-in-95 duration-150`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        {title && (
          <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {icon && <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">{icon}</span>}
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              title="Close modal"
            >
              <CloseIcon className="w-4 h-4" />
            </button>

          </div>
        )}
        {/* body */}
        {children}
      </div>
    </div>
  );
};
