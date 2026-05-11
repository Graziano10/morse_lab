"use client";

import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  valueDisplay?: string;
}

export function Slider({ label, valueDisplay, className, id, ...props }: SliderProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
            {label}
          </label>
          {valueDisplay && (
            <span className="text-sm font-mono text-emerald-400">{valueDisplay}</span>
          )}
        </div>
      )}
      <input
        id={inputId}
        type="range"
        className={cn(
          "w-full h-2 rounded-full appearance-none cursor-pointer",
          "bg-slate-700",
          "accent-emerald-500",
          "[&::-webkit-slider-thumb]:appearance-none",
          "[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4",
          "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500",
          "[&::-webkit-slider-thumb]:cursor-pointer",
          "[&:focus]:outline-none [&:focus-visible]:ring-2 [&:focus-visible]:ring-emerald-500",
          className
        )}
        {...props}
      />
    </div>
  );
}
