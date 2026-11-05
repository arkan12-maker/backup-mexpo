"use client";

import React, { useEffect, useState } from "react";
import { Phone } from "lucide-react";

interface PhoneInputProps {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string | boolean;
  hint?: string;
  className?: string;
  id?: string;
  name?: string;
}

/** Formats digits into dashed phone format: 0812-3456-7890 */
function formatPhoneNumber(val?: string): string {
  if (!val) return "";
  const digits = val.replace(/\D/g, "");
  if (digits.length <= 4) return digits;
  if (digits.length <= 8) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8, 13)}`;
}

export default function PhoneInput({
  label,
  value = "",
  onChange,
  placeholder = "0812-3456-7890",
  required = false,
  disabled = false,
  error,
  hint,
  className = "",
  id,
  name,
}: PhoneInputProps) {
  const [displayValue, setDisplayValue] = useState(() => formatPhoneNumber(value));

  useEffect(() => {
    setDisplayValue(formatPhoneNumber(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 13);
    const formatted = formatPhoneNumber(raw);
    setDisplayValue(formatted);
    // Send raw clean digits to parent/form
    onChange(raw);
  };

  const errorMessage = typeof error === "string" ? error : undefined;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block font-medium text-gray-700 text-sm"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center rounded-xl border border-gray-200 bg-white shadow-2xs focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/15 transition-all overflow-hidden">
        <div className="flex items-center justify-center pl-3.5 pr-2.5 text-gray-400 select-none">
          <Phone className="w-4 h-4 text-gray-400" />
        </div>

        <input
          type="tel"
          inputMode="tel"
          id={id}
          name={name}
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="w-full h-11 px-2 py-2.5 text-sm text-gray-900 bg-transparent placeholder:text-gray-400 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400 font-medium"
        />
      </div>

      {hint && !errorMessage && (
        <p className="text-[11px] text-gray-400 leading-tight">{hint}</p>
      )}

      {errorMessage && (
        <p className="text-[11px] text-rose-500 font-medium leading-tight">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

