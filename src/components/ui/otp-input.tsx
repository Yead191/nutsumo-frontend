"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  onComplete?: (value: string) => void;
}

export function OtpInput({
  value,
  onChange,
  length = 4,
  disabled = false,
  autoFocus = true,
  onComplete,
}: OtpInputProps) {
  const inputs = React.useRef<Array<HTMLInputElement | null>>([]);

  const digits = React.useMemo(() => {
    const arr = value.split("").slice(0, length);
    while (arr.length < length) arr.push("");
    return arr;
  }, [value, length]);

  const focusAt = (index: number) => {
    const el = inputs.current[Math.max(0, Math.min(index, length - 1))];
    el?.focus();
    el?.select();
  };

  const commit = (next: string) => {
    const clean = next.replace(/\D/g, "").slice(0, length);
    onChange(clean);
    if (clean.length === length) onComplete?.(clean);
  };

  const handleChange = (index: number, raw: string) => {
    const char = raw.replace(/\D/g, "");
    if (!char) return;

    const arr = [...digits];
    const chars = char.split("");
    let cursor = index;
    for (const c of chars) {
      if (cursor >= length) break;
      arr[cursor] = c;
      cursor += 1;
    }
    commit(arr.join(""));
    focusAt(cursor);
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const arr = [...digits];
      if (arr[index]) {
        arr[index] = "";
        commit(arr.join(""));
      } else if (index > 0) {
        arr[index - 1] = "";
        commit(arr.join(""));
        focusAt(index - 1);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusAt(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusAt(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    commit(pasted.slice(0, length));
    focusAt(pasted.length);
  };

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4 my-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={length}
          value={digit}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          aria-label={`Digit ${index + 1}`}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={cn(
            "h-14 w-12 sm:h-16 sm:w-14 rounded-2xl border text-center text-2xl font-bold transition-all duration-200 outline-none select-none",
            "focus:border-[#FE375D] focus:ring-4 focus:ring-[#FE375D]/15 focus:bg-white",
            digit
              ? "border-[#FE375D] bg-[#FFF8F9] text-slate-900"
              : "border-slate-200 bg-[#FFF9FA]/60 text-slate-700",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />
      ))}
    </div>
  );
}
