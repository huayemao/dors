import { parseMDXClient } from "@/lib/mdx/parseMDXClient";
import { BasePlaceload } from "@shuriken-ui/react";
import { MDXContent } from "mdx/types";
import { useEffect, useState } from "react";

export default function ParsedMdx({
  content,
  onParse = () => {},
}: {
  content: string;
  onParse?: () => void;
}) {
  const [result, setRes] = useState<MDXContent>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    parseMDXClient(content)
      .then(setRes)
      .finally(() => {
        setLoading(false);
        setTimeout(onParse)
      });
  }, [content]);

  return (
    <>
      {typeof result == "function" ? (
        result({})
      ) : !loading ? (
        result
      ) : (
        <div className="space-y-2">
          <BasePlaceload className="h-4 w-full rounded" />
          <BasePlaceload className="h-4 w-3/4 rounded" />
          <BasePlaceload className="h-4 w-full rounded" />
        </div>
      )}
    </>
  );
}
