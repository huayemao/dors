"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

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

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    const qs = createQueryString("lang", lang);
    router.push(`${pathname}?${qs}`);
  };

  return (
    <div className={className}>
      <label htmlFor="lang-switcher" className="sr-only">
        Language
      </label>
      <select
        id="lang-switcher"
        value={currentLang}
        onChange={onChange}
        className="rounded-md border border-muted-300 dark:border-muted-700 bg-white dark:bg-muted-800 text-sm px-3 py-2"
      >
        <option value="en">English</option>
        <option value="zh">中文</option>
      </select>
    </div>
  );
} 