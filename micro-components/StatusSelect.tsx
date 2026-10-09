"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { LEADS_STATUS_ENUM } from "@/common/enums";
import { ChevronDownIcon } from "@/common/icon";

// status option item interface
interface StatusItem {
  value: LEADS_STATUS_ENUM;
  label: string;
  dotColor: string;
}

// status options for form selection
export const formStatusOptions: StatusItem[] = [
  { value: LEADS_STATUS_ENUM.NEW, label: "New", dotColor: "bg-sky-500" },
  { value: LEADS_STATUS_ENUM.CONTACTED, label: "Contacted", dotColor: "bg-amber-500" },
  { value: LEADS_STATUS_ENUM.QUALIFIED, label: "Qualified", dotColor: "bg-emerald-500" },
  { value: LEADS_STATUS_ENUM.LOST, label: "Lost", dotColor: "bg-rose-500" },
];

// status select component props interface
interface StatusSelectProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  isView?: boolean;
  className?: string;
}

// reusable status dropdown selector for lead forms
export const StatusSelect: React.FC<StatusSelectProps> = ({
  id = "lead-status",
  label = "Status",
  value,
  onChange,
  disabled = false,
  isView = false,
  className = "",
}) => {
  // dropdown open state
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // current active status option
  const currentOption = useMemo(() => {
    return (
      formStatusOptions.find((opt) => opt.value === value) ||
      formStatusOptions[0]
    );
  }, [value]);

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5"
        >
          {label}
        </label>
      )}

      {isView ? (
        <div className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-100/70 border border-slate-200 text-slate-800 cursor-not-allowed select-text flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className={`w-2.5 h-2.5 rounded-full ${currentOption.dotColor}`} />
            <span className="font-medium text-slate-800">{currentOption.label}</span>
          </div>
        </div>
      ) : (
        <>
          <button
            id={id}
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen((prev) => !prev)}
            className={`w-full px-4 py-2.5 text-sm rounded-xl transition-all flex items-center justify-between cursor-pointer ${
              isOpen
                ? "bg-white border border-blue-500 ring-2 ring-blue-500/20 text-slate-800"
                : "bg-slate-50/70 border border-slate-200 hover:bg-white hover:border-slate-300 text-slate-800"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`w-2.5 h-2.5 rounded-full ${currentOption.dotColor}`} />
              <span className="font-medium text-slate-800">{currentOption.label}</span>
            </div>
            <ChevronDownIcon
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                isOpen ? "rotate-180 text-blue-600" : ""
              }`}
            />
          </button>

          {/* status dropdown options menu */}
          {isOpen && (
            <div className="absolute left-0 right-0 mt-1.5 w-full rounded-xl bg-white border border-slate-200 shadow-xl p-1.5 z-30 space-y-0.5">
              {formStatusOptions.map((opt) => {
                const isSelected = value === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/80 text-blue-700 font-semibold"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${opt.dotColor}`} />
                      <span>{opt.label}</span>
                    </div>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
