"use client";
import React, { useState, useRef, useEffect } from "react";
import { LEADS_STATUS_ENUM } from "@/common/enums";
import {
  FilterIcon,
  ChevronDownIcon,
  CloseIcon,
} from "@/common/icon";

// lead status dropdown option interface
export interface StatusOption {
  label: string;
  value: string;
  dotColor: string;
}

// lead status dropdown options
export const statusOptions: StatusOption[] = [
  {
    label: "All Statuses",
    value: "",
    dotColor: "bg-slate-400",
  },
  {
    label: "New",
    value: LEADS_STATUS_ENUM.NEW,
    dotColor: "bg-sky-500",
  },
  {
    label: "Contacted",
    value: LEADS_STATUS_ENUM.CONTACTED,
    dotColor: "bg-amber-500",
  },
  {
    label: "Qualified",
    value: LEADS_STATUS_ENUM.QUALIFIED,
    dotColor: "bg-emerald-500",
  },
  {
    label: "Lost",
    value: LEADS_STATUS_ENUM.LOST,
    dotColor: "bg-rose-500",
  }
];
// status dropdown props type
interface StatusDropdownFilterProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  disabled?: boolean;
}
export const StatusDropdownFilter: React.FC<StatusDropdownFilterProps> = ({
  selectedStatus,
  onStatusChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // current selected status option
  const currentOption =
    statusOptions.find((opt) => opt.value === selectedStatus) ||
    statusOptions[0];
  // check filter is applied
  const isFiltered = Boolean(selectedStatus);
  // close the dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    // clean up event listeners on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);
  // handle select filter option
  const handleSelect = (value: string) => {
    onStatusChange(value);
    setIsOpen(false);
  };
  // handle clear filter option
  const handleClear = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onStatusChange("");
  };
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div
        className={`inline-flex items-center rounded-xl border text-sm font-medium transition-all shadow-xs ${
          isFiltered
            ? "border-blue-200 bg-blue-50/50 text-blue-950 hover:bg-blue-50/80 hover:border-blue-300 ring-2 ring-blue-500/10"
            : "border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300"
        } ${isOpen ? "ring-2 ring-blue-500/20 border-blue-500" : ""}`}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="true"
          aria-expanded={isOpen}
          title={`Filter by status (currently: ${currentOption.label})`}
          className={`group inline-flex items-center gap-2.5 h-10 pl-3.5 ${
            isFiltered ? "pr-1.5" : "pr-3.5"
          } rounded-xl cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none`}
        >
          <div className="flex items-center gap-2">
            {isFiltered ? (
              <span
                className={`w-2 h-2 rounded-full ${currentOption.dotColor} ring-2 ring-offset-1 ring-slate-100`}
              />
            ) : (
              <FilterIcon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            )}
            <span
              className={`text-sm ${
                isFiltered
                  ? "font-semibold text-slate-900"
                  : "font-medium text-slate-700"
              }`}
            >
              {currentOption.label}
            </span>
          </div>
          <ChevronDownIcon
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isOpen
                ? "rotate-180 text-blue-600"
                : "group-hover:text-slate-600"
            }`}
          />
        </button>
        {isFiltered && (
          <button
            type="button"
            disabled={disabled}
            onClick={handleClear}
            title="Reset status filter to All"
            aria-label="Reset status filter to All"
            className="p-1 mr-2 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
          >
            <CloseIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {/* dropdown menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-45 rounded-2xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/10 p-2 z-30 animate-in fade-in zoom-in-95 duration-150 origin-top-right focus:outline-none"
        >
          {/* options list */}
          <div className="py-1 space-y-0.5">
            {statusOptions.map((option) => {
              const isSelected = selectedStatus === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="menuitem"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-sm transition-colors cursor-pointer group ${
                    isSelected
                      ? "bg-blue-50/80 text-blue-950 font-semibold"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2 h-2 rounded-full ${option.dotColor} ${
                        isSelected ? "ring-2 ring-blue-500/30" : ""
                      }`}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm leading-tight">
                        {option.label}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
