"use client"
import { parseMDXClient } from "@/lib/mdx/parseMDXClient";
import { MDXContent } from "mdx/types";
import { useEffect, useState } from "react";

export default function ParsedMdx({ content }: { content: string }) {
    const [result, setRes] = useState<MDXContent>();
    useEffect(() => {
        parseMDXClient(content).then(setRes);
    }, [])

    return (
        <>
            {typeof result == 'function' ? result({}) : typeof result != 'string' ? result : content}
        </>
    );
}
