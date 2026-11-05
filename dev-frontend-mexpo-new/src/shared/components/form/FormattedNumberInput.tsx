"use client";

import React, { useEffect, useState } from "react";

interface FormattedNumberInputProps {
  label?: string;
  value?: number | string;
  onChange: (value: number) => void;
  placeholder?: string;
  suffix?: string;
  min?: number;
  max?: number;
  required?: boolean;
  disabled?: boolean;
  error?: string | boolean;
  hint?: string;
  className?: string;
  id?: string;
  name?: string;
}

function formatNumber(val: number | string | undefined | null): string {
  if (val === undefined || val === null || val === "") return "";
  const num = typeof val === "number" ? val : Number(String(val).replace(/\D/g, ""));
  if (isNaN(num)) return "";
  return new Intl.NumberFormat("id-ID").format(num);
}

export default function FormattedNumberInput({
  label,
  value,
  onChange,
  placeholder = "0",
  suffix,
  min = 0,
  max,
  required = false,
  disabled = false,
  error,
  hint,
  className = "",
  id,
  name,
}: FormattedNumberInputProps) {
  const [displayValue, setDisplayValue] = useState<string>(() =>
    formatNumber(value)
  );

  useEffect(() => {
    setDisplayValue(formatNumber(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/\D/g, "");
    let numericValue = rawDigits === "" ? 0 : Number(rawDigits);

    if (max !== undefined && numericValue > max) {
      numericValue = max;
    }

    if (rawDigits === "") {
      setDisplayValue("");
    } else {
      setDisplayValue(new Intl.NumberFormat("id-ID").format(numericValue));
    }

    onChange(numericValue);
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
        <input
          type="text"
          inputMode="numeric"
          id={id}
          name={name}
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="w-full h-11 px-4 py-2.5 text-sm text-gray-900 bg-transparent placeholder:text-gray-400 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400 font-medium"
        />

        {suffix && (
          <div className="flex items-center justify-center px-3.5 py-2.5 bg-gray-50 border-l border-gray-100 text-gray-500 font-medium text-xs select-none shrink-0">
            {suffix}
          </div>
        )}
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

