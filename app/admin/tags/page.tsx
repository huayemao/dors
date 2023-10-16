import Input from "@/components/Base/Input";
import { getTags } from "@/lib/tags";
import Link from "next/link";

async function Tags() {
  const tags = await getTags();

  const pattern = `^(?!.*(${tags.map((e) => e.name).join("|")})).*$`;

  return (
    <div className="space-y-8 p-8">
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
      <form action="/api/createTag" method="POST" className="w-96 rounded shadow bg-white p-8 mx-auto">
        <Input label="名称" id="name" pattern={pattern} required></Input>
      </form>
    </div>
  );
}

export default Tags;
