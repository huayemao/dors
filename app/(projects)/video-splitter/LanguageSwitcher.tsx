"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { BaseSelect } from "@shuriken-ui/react";

export default function LanguageSwitcher({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentLang = (searchParams.get("lang") || "en").toLowerCase() === "zh" ? "zh" : "en";

  const createQueryString = useMemo(() => {
    return (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    };
  }, [searchParams]);

  const onChange = (value: string) => {
    const qs = createQueryString("lang", value);
    router.push(`${pathname}?${qs}`);
  };

  return (
    <div className={className}>
      <BaseSelect
        size="sm"
        labelFloat
        label="Language"
        value={currentLang}
        onChange={onChange}
      >
        <option value="en">English</option>
        <option value="zh">中文</option>
      </BaseSelect>
    </div>
  );
} 