import { getTags } from "@/lib/tags";
import Link from "next/link";
import { TagForm } from "./TagForm";

async function Tags({ searchParams }) {
  const { id } = searchParams;
  const tagId = parseInt(id);
  const tags = await getTags();
  const isEditing = !Number.isNaN(tagId);

  return (
    <div className="space-y-8 p-8">
      <div className="border p-10 flex flex-wrap gap-4  justify-center max-w-3xl mx-auto">
        {tags.map(({ name, id }) => {
          return (
            <Link
              href={`/admin/tags?id=${id}`}
              key={id}
              className="font-sans py-1.5 px-3 rounded-xl text-sm text-muted-500 dark:text-muted-300 bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700 shadow-lg shadow-muted-400/20 dark:shadow-muted-700/20"
            >
              {name}
            </Link>
          );
        })}
      </div>
      {<TagForm id={id} isEditing={isEditing} tags={tags}></TagForm>}
    </div>
  );
}

export type Props = {
  isEditing: boolean;
  id: number;
  tags: {
    id: number;
    name: string | null;
  }[];
};

export default Tags;
