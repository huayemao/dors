"use client";
import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { BaseButton, BaseInput } from "@glint-ui/react";
import { X } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  debounceDelay?: number;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "搜索...",
  onClear,
  debounceDelay = 300,
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, debounceDelay);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
      setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (debouncedValue !== value) {
      onChangeRef.current(debouncedValue);
    }
  }, [debouncedValue]);

  const handleClear = () => {
    setLocalValue("");
    onClear?.();
  };

  return (
    <div className="relative">
      <BaseInput
        placeholder={placeholder}
        value={localValue}
        onChange={(v: string) => setLocalValue(v)}
        className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 shadow-sm"
      />
      {localValue && (
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
