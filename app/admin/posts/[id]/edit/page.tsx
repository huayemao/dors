import Input from "@/components/Base/Input";
import Select from "@/components/Base/Select";
import { getAllCategories } from "@/lib/categories";
import { getPost } from "@/lib/posts";
import { PexelsPhoto } from "@/lib/types/PexelsPhoto";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function page({ params }) {
  if (!params.id) {
    return;
  }

  const post = await getPost(parseInt(params.id as string));

  const categories = await getAllCategories();

  if (!post) {
    return notFound();
  }

  const categoryId = post.posts_category_links[0]?.category_id;

  return (
    <main className="w-full px-8 py-4">
      <form
        action="/api/updatePost"
        method="post"
        className="grid grid-cols-1 md:grid-cols-12 gap-4"
      >
        <input hidden name="id" defaultValue={post.id} />
        <div className="col-span-4 space-y-4">
          <Input
            label="标题"
            id={"title"}
            defaultValue={post.title || ""}
            name="title"
          />
          <Select
            label="分类"
            id="category"
            name="category"
            defaultValue={categoryId ? String(categoryId) : undefined}
            data={categories.map((e) => ({
              value: String(e.id),
              label: e.name as string,
            }))}
          />
          <div className="flex gap-2">
            <Image
              width={300}
              height={240}
              alt={(post.cover_image as PexelsPhoto).alt}
              src={(post.cover_image as PexelsPhoto).src.medium}
            />
            <label>
              更换图片
              <input
                type="checkbox"
                name="changePhoto"
                defaultChecked={false}
              />
            </label>
          </div>
        </div>
        <div className="relative col-span-8">
          <label htmlFor="content" className="nui-label pb-1 text-[0.825rem]">
            内容
          </label>
          <div className="group/nui-textarea relative flex flex-col">
            <textarea
              id="content"
              name="content"
              className="nui-focus border-muted-300 placeholder:text-muted-300 focus:border-muted-300 focus:shadow-muted-300/50 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 dark:focus:shadow-muted-800/50 peer w-full border bg-white font-sans transition-all duration-300 focus:shadow-lg disabled:cursor-not-allowed disabled:opacity-75 min-h-[2.5rem] text-sm leading-[1.6] rounded resize-none p-2"
              placeholder="输入文章内容"
              rows={26}
              defaultValue={post.content || ""}
            />
          </div>
        </div>
        <button
          className="relative inline-flex items-center justify-center leading-5 no-underline w-full md:w-auto min-w-[130px] space-x-1 text-white bg-primary-500 h-12 px-5 py-3 text-base rounded-xl hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-500/20 tw-accessibility transition-all duration-300"
          type="submit"
        >
          保存
        </button>
      </form>
    </main>
  );
}
