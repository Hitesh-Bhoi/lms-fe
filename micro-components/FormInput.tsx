"use client";
import React from "react";

// form input component props interface
interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
  className?: string;
}

// reusable form input component with label, icon, and error handling
export const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  error,
  icon,
  className = "",
}) => {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-sm font-medium capitalize text-slate-700 mb-1.5"
      >
        {label} {required && !disabled && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          disabled={disabled}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full py-2.5 text-sm rounded-xl transition-all ${
            icon ? "pl-10 pr-4" : "px-4"
          } ${
            disabled
              ? "bg-slate-100/70 border border-slate-200 text-slate-800 cursor-not-allowed select-text"
              : error
                ? "border border-rose-300 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/20 text-slate-800"
                : "bg-slate-50/70 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
          }`}
        />
      </div>
      {error && (
        <p className="text-xs text-rose-500 mt-1 font-medium">{error}</p>
      )}
    </div>
  );
};
