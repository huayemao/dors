import Link from "next/link";
import { BaseCard } from "@shuriken-ui/react";

export default function DiaryNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
      <BaseCard rounded="md" className="max-w-md w-full p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">日记未找到</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          您请求的日记集合不存在或已被删除。
        </p>
        <Link 
          href="/diaries" 
          className="inline-flex items-center justify-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
        >
          返回日记列表
        </Link>
      </BaseCard>
    </div>
  );
} 