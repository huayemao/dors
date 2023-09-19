import { getTags } from "@/lib/tags";
import Link from "next/link";

export default async function TagsPage() {
  const tags = await getTags();
  return (
    <div className="flex flex-wrap gap-4  justify-center max-w-3xl mx-auto">
      {tags.map(({ name, id }) => {
        return (
          <Link
            href={`/tags/${id}`}
            key={id}
            className="font-sans py-1.5 px-3 rounded-xl text-sm text-muted-500 dark:text-muted-300 bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700 shadow-lg shadow-muted-400/20 dark:shadow-muted-700/20"
          >
            {name}
          </Link>
        );
      })}
    </div>
  );
}
