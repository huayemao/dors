"use client";
import { useState } from "react";
import { BaseButton, BaseInput } from "@glint-ui/react";
import { X } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "搜索...",
  onClear,
}: SearchInputProps) {
  const handleClear = () => {
    onChange("");
    onClear?.();
  };

  return (
    <div className="relative">
      <BaseInput
        placeholder={placeholder}
        value={value}
        onChange={(v: string) => onChange(v)}
        className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 shadow-sm"
      />
      {value && (
        <BaseButton
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full hover:bg-gray-100 transition-colors"
          onClick={handleClear}
        >
          <X className="h-4 w-4 text-gray-500" />
        </BaseButton>
      )}
    </div>
  );
}
