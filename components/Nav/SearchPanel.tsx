import React, { useRef, useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { XIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Post = {
    id: number;
    title: string;
    slug: string;
}

type Tag = {
    id: number;
    name: string;
}

interface SearchPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SearchResult {
    posts: Post[];
    tags: Tag[];
}

export const SearchPanel = ({ isOpen, onClose }: SearchPanelProps) => {
    const [query, setQuery] = useState<string>("");
    const [results, setResults] = useState<SearchResult>({ posts: [], tags: [] });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Debounce search input
    useEffect(() => {
        if (!query.trim()) {
            setResults({ posts: [], tags: [] });
            return;
        }

        const delayDebounce = setTimeout(() => {
            performSearch(query);
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [query]);

    const performSearch = async (term: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ q: term }),
            });
            const data = await response.json();
            setResults({
                posts: data.posts || [],
                tags: data.tags || [],
            });
        } catch (err) {
            setError("搜索失败，请稍后再试。");
            console.error("Search failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = (href: string, text: string, isTag: boolean = false) => (
        <li>
            {/* Using plain a tag instead of Link to avoid prefetching */}
            <a
                href={href}
                className={`
                    block rounded-md p-2 transition-all
                    hover:bg-muted-100 dark:hover:bg-muted-700
                    ${isTag ? 'text-primary-600 dark:text-primary-400' : 'text-foreground'}
                    hover:text-primary-800 dark:hover:text-primary-300
                `}
                onClick={() => onClose()}
            >
                {text}
            </a>
        </li>
    );

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            className="z-50 fixed inset-0 bg-muted-800/70 dark:bg-muted-900/80"
            as={motion.div}
        >
            <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Dialog.Panel
                    className={cn(
                        "dark:bg-muted-800 w-full bg-white text-left align-middle shadow-xl rounded-xl max-w-lg mx-4 overflow-hidden"
                    )}
                    as={motion.div}
                    initial={{ scale: 0.75, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                >
                    <div className="p-4 border-b dark:border-muted-700">
                        <div className="relative">
                            <input
                                ref={searchInputRef}
                                type="search"
                                placeholder="搜索文章或标签..."
                                className="w-full py-3 px-4 pr-10 text-lg rounded-md 
                                border border-muted-300 dark:border-muted-600
                                focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400
                                bg-white dark:bg-muted-800 text-foreground dark:text-white
                                transition-shadow ease-in-out duration-200"
                                autoFocus
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <svg
                                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-500 dark:text-muted-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="absolute right-4 top-4 text-muted-500 hover:text-muted-700 dark:hover:text-muted-300 focus:outline-none"
                        onClick={onClose}
                    >
                        <span className="sr-only">关闭搜索</span>
                        <XIcon
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                        </XIcon>
                    </button>

                    {/* Search Results */}
                    <div className="p-4 max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="py-6 flex justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                            </div>
                        ) : error ? (
                            <p className="text-center text-red-500 py-4">{error}</p>
                        ) : (
                            <>
                                {results.posts.length > 0 && (
                                    <div className="mt-1">
                                        <h3 className="font-medium text-muted-700 dark:text-muted-300 px-2 mb-2">
                                            文章结果
                                        </h3>
                                        <ul className="space-y-1">
                                            {results.posts.map((post) =>
                                                renderItem(`/posts/${post.slug || post.id}`, post.title)
                                            )}
                                        </ul>
                                    </div>
                                )}

                                {results.tags.length > 0 && (
                                    <div className="mt-6 pt-6 border-t dark:border-muted-700">
                                        <h3 className="font-medium text-muted-700 dark:text-muted-300 px-2 mb-2">
                                            标签结果
                                        </h3>
                                        <ul className="space-y-1">
                                            {results.tags.map((tag) =>
                                                renderItem(`/tags/${tag.id}`, tag.name, true)
                                            )}
                                        </ul>
                                    </div>
                                )}

                                {(results.posts.length === 0 && results.tags.length === 0 && query.trim() !== "") && (
                                    <p className="text-center text-muted-500 dark:text-muted-400 py-8">
                                        没有找到匹配的内容
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};
