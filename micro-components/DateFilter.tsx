"use client";
import React, { useState, useRef, useEffect } from "react";
import { CalendarIcon, ChevronDownIcon, CloseIcon } from "@/common/icon";

export interface DateRangePreset {
  label: string;
  getRange: () => { startDate: string; endDate: string };
}

// helper to format date as YYYY-MM-DD in local time
const toYMD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const datePresets: DateRangePreset[] = [
  {
    label: "Today",
    getRange: () => {
      const today = toYMD(new Date());
      return { startDate: today, endDate: today };
    },
  },
  {
    label: "Yesterday",
    getRange: () => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      const yesterday = toYMD(d);
      return { startDate: yesterday, endDate: yesterday };
    },
  },
  {
    label: "Last 7 Days",
    getRange: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 6);
      return { startDate: toYMD(start), endDate: toYMD(end) };
    },
  },
  {
    label: "Last 30 Days",
    getRange: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 29);
      return { startDate: toYMD(start), endDate: toYMD(end) };
    },
  },
  {
    label: "This Month",
    getRange: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { startDate: toYMD(start), endDate: toYMD(now) };
    },
  },
];

interface DateFilterProps {
  startDate: string;
  endDate: string;
  onDateChange: (startDate: string, endDate: string) => void;
  disabled?: boolean;
}

export const DateFilter: React.FC<DateFilterProps> = ({
  startDate,
  endDate,
  onDateChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // custom inputs local state
  const [customStart, setCustomStart] = useState(startDate);
  const [customEnd, setCustomEnd] = useState(endDate);

  // sync custom inputs when parent props change
  useEffect(() => {
    setCustomStart(startDate);
    setCustomEnd(endDate);
  }, [startDate, endDate]);

  const isFiltered = Boolean(startDate || endDate);

  // resolve display label
  const getDisplayLabel = () => {
    if (!isFiltered) return "Date Filter";

    // check if matches any preset
    for (const preset of datePresets) {
      const range = preset.getRange();
      if (range.startDate === startDate && range.endDate === endDate) {
        return preset.label;
      }
    }

    if (startDate && endDate) {
      if (startDate === endDate) return startDate;
      return `${startDate} - ${endDate}`;
    }
    if (startDate) return `From ${startDate}`;
    if (endDate) return `Until ${endDate}`;
    return "Date Filter";
  };

  // close dropdown on outside click or Escape
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleApplyPreset = (preset: DateRangePreset) => {
    const range = preset.getRange();
    onDateChange(range.startDate, range.endDate);
    setIsOpen(false);
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    onDateChange(customStart, customEnd);
    setIsOpen(false);
  };

  const handleClear = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCustomStart("");
    setCustomEnd("");
    onDateChange("", "");
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
          title={`Filter by date (${getDisplayLabel()})`}
          className={`group inline-flex items-center gap-2.5 h-10 pl-3.5 ${
            isFiltered ? "pr-1.5" : "pr-3.5"
          } rounded-xl cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none`}
        >
          <div className="flex items-center gap-2">
            <CalendarIcon
              className={`w-4 h-4 transition-colors ${
                isFiltered
                  ? "text-blue-600"
                  : "text-slate-400 group-hover:text-blue-600"
              }`}
            />
            <span
              className={`text-sm ${
                isFiltered
                  ? "font-semibold text-slate-900"
                  : "font-medium text-slate-700"
              }`}
            >
              {getDisplayLabel()}
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
            title="Reset date filter"
            aria-label="Reset date filter"
            className="p-1 mr-2 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
          >
            <CloseIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/10 p-3 z-30 animate-in fade-in zoom-in-95 duration-150 origin-top-right focus:outline-none"
        >
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-1">
            Quick Ranges
          </div>
          <div className="py-1 space-y-0.5">
            {datePresets.map((preset) => {
              const range = preset.getRange();
              const isSelected =
                startDate === range.startDate && endDate === range.endDate;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left text-sm transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-blue-50/80 text-blue-900 font-semibold"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span>{preset.label}</span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-100 my-2 pt-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-1">
              Custom Range
            </div>
            <form onSubmit={handleApplyCustom} className="space-y-2 mt-1 px-1">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleClear}
                  className="w-1/2 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={!customStart && !customEnd}
                  className="w-1/2 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
