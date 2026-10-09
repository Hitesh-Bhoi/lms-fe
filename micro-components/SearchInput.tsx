"use client";
import React from "react";
import { SearchIcon, CloseIcon } from "@/common/icon";

// search input props interface
interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  placeholder?: string;
  className?: string;
}

// reusable search input component with search icon and clear button
export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onClear,
  placeholder = "Search leads by name or email...",
  className = "relative flex-1 max-w-md",
}) => {
  return (
    <div className={className}>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <SearchIcon className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-800"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          title="Clear search query"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
