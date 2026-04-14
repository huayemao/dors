"use client";
import { SearchInput } from "@/components/SearchInput";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function FileSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mb-4">
      <SearchInput
        value={searchTerm}
        onChange={handleSearch}
        placeholder="搜索文件名..."
      />
    </div>
  );
}
