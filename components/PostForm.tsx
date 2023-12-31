"use client";
import { CategoriesContext } from "@/contexts/categories";
import { TagsContext } from "@/contexts/tags";
import { getPost } from "@/lib/posts";
import { Settings } from "lucide-react";
import Link from "next/link";
import { FormEventHandler, useContext, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Button from "./Base/Button";
import Select from "./Base/Select";

export type PostFormProps = {
  post: Awaited<ReturnType<typeof getPost>>;
};

const handleOnSubmit: FormEventHandler<HTMLFormElement> = (e) => {
  const changedFields = [];
  const formData = new FormData(e.target as HTMLFormElement);
  (e.target as HTMLFormElement)
    .querySelectorAll("input, select, textarea")
    .forEach((el) => {
      // @ts-ignore
      const formDataValue = el.multiple
        ? // @ts-ignore
          formData.getAll(el.name).sort().join(",")
        : // @ts-ignore
          formData.get(el.name);
      // @ts-ignore
      const originalValue = el.dataset.originalValue;
      if (String(originalValue) === String(formDataValue)) {
        // @ts-ignore
        el.disabled = true;
      } else {
        // @ts-ignore
        changedFields.push(el.name);
      }
    });
  if (changedFields.length < 2) {
    e.preventDefault();
    (e.target as HTMLFormElement)
      .querySelectorAll("input, select, textarea")
      .forEach((el) => {
        // @ts-ignore
        el.disabled = false;
      });
  }
};

export function PostForm({ post }: PostFormProps) {
  const categories = useContext(CategoriesContext);
  const tags = useContext(TagsContext);

  const [content, setContent] = useState(post?.content || "");

  const categoryId = post?.posts_category_links[0]?.category_id;

  return (
    <form
      className="bg-white dark:bg-black"
      action={post ? "/api/updatePost" : "/api/createPost"}
      method="POST"
      onSubmit={handleOnSubmit}
    >
      {post && (
        <input
          hidden
          name="id"
          id="id"
          defaultValue={post.id}
          data-original-value={post.id}
        />
      )}

      <div className="relative min-h-[500px] w-full max-w-screen-lg border-stone-200 p-12 px-8 dark:border-stone-700 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg">
        <div className="absolute right-5 top-5 mb-5 flex items-center space-x-3">
          {post && (
            <Link
              href={`/admin/posts/${post.id}/settings`}
              className="flex items-center space-x-1 text-sm text-stone-400 hover:text-stone-500"
            >
              <Settings className="h-4 w-4" />
            </Link>
          )}

          <Button type="submit" size="sm">
            保存
          </Button>
        </div>

        <div className="mb-5 flex flex-col space-y-3 border-b border-stone-200 pb-5 dark:border-stone-700">
          <div className="w-24">
            <Select
              size="sm"
              required
              labelFloat
              label="分类"
              id="category"
              name="category"
              defaultValue={categoryId ? String(categoryId) : undefined}
              data-original-value={categoryId ? String(categoryId) : undefined}
              data={categories.map((e) => ({
                value: String(e.id),
                label: e.name as string,
              }))}
            />
          </div>
          <input
            id={"title"}
            name="title"
            placeholder="标题"
            className="dark:placeholder-text-600 border-none px-0 font-cal text-3xl placeholder:text-stone-400 focus:outline-none focus:ring-0 dark:bg-black dark:text-white"
            type="text"
            data-original-value={post?.title}
            defaultValue={post?.title || ""}
          />
          <textarea
            placeholder="摘要"
            id="abstract"
            name="abstract"
            data-original-value={""}
            // todo
            value={""}
            className="dark:placeholder-text-600 w-full resize-none border-none px-0 placeholder:text-stone-400 focus:outline-none focus:ring-0 dark:bg-black dark:text-white"
          />
        </div>
        <div>
          <TextareaAutosize
            minRows={8}
            id="content"
            name="content"
            onInput={(e) => {
              const thisEl = e.target as HTMLTextAreaElement;
              setContent(thisEl.value);
            }}
            defaultValue={post?.content || ""}
            data-original-value={post?.content}
            placeholder="正文"
            className="resize-none dark:placeholder-text-600 w-full border-none px-0 placeholder:text-stone-400 focus:outline-none focus:ring-0 dark:bg-black dark:text-white"
          />
        </div>
      </div>
    </form>
  );

  // return (
  //   <form
  //     action="/api/updatePost"
  //     method="post"
  //     className="grid grid-cols-1 md:grid-cols-12 gap-8"
  //     onSubmit={handleOnSubmit}
  //   >
  //     <div className="col-span-4 space-y-4">
  //       <input hidden name="id" id="id" defaultValue={post.id} />
  //       <div className="py-6">
  //         <Image
  //           width={300}
  //           height={240}
  //           className="w-full"
  //           alt={(post.cover_image as PexelsPhoto).alt}
  //           src={(post.cover_image as PexelsPhoto).src.medium}
  //         />
  //         <label>
  //           更换图片
  //           <input
  //             type="checkbox"
  //             id="changePhoto"
  //             name="changePhoto"
  //             defaultChecked={false}
  //             data-original-value={"null"}
  //           />
  //         </label>
  //       </div>
  //       <Input
  //         required
  //         label="标题"
  //         id={"title"}
  //         defaultValue={post.title || ""}
  //         name="title"
  //         data-original-value={post.title}
  //       />
  //       <div className="grid grid-cols-2 gap-4">
  //         <div>

  //         </div>
  //         <div>
  //           <Select
  //             multiple
  //             height={90}
  //             label="标签"
  //             id="tags"
  //             name="tags"
  //             defaultValue={post.tags.map((e) => String(e?.name)).sort()}
  //             data-original-value={post.tags.map((e) => String(e?.name)).sort()}
  //             data={tags.map((e) => ({
  //               value: String(e.name),
  //               label: e.name as string,
  //             }))}
  //             className="lg:h-[180px]"
  //           />
  //         </div>
  //       </div>

  //       <div className="grid grid-cols-2 gap-4">
  //         <div>
  //           <Input
  //             type="datetime-local"
  //             label="自定义修改时间"
  //             id={"updated_at"}
  //             name="updated_at"
  //             // 不传修改为当前时间
  //             defaultValue={""}
  //             data-original-value={""}
  //           />
  //         </div>
  //         <div>
  //           <Input
  //             type="datetime-local"
  //             label="自定义创建时间"
  //             id={"created_at"}
  //             name="created_at"
  //             defaultValue={post.created_at?.toISOString().slice(0, 16)}
  //             data-original-value={post.created_at?.toISOString().slice(0, 16)}
  //           />
  //         </div>
  //         <button onClick={syncUpdateTime}>修改时间使用创建时间</button>
  //       </div>
  //     </div>
  //     <div className="relative col-span-8">
  //       <label htmlFor="content" className="nui-label pb-1 text-[0.825rem]">
  //         内容
  //       </label>
  //       <div className="group/nui-textarea relative flex flex-col">
  //         <textarea
  //           required
  //           id="content"
  //           name="content"
  //           className="nui-focus border-muted-300 placeholder:text-muted-300 focus:border-muted-300 focus:shadow-muted-300/50 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 dark:focus:shadow-muted-800/50 peer w-full border bg-white font-sans transition-all duration-300 focus:shadow-lg disabled:cursor-not-allowed disabled:opacity-75 min-h-[2.5rem] text-sm leading-[1.6] rounded resize-none p-2"
  //           placeholder="输入文章内容"
  //           rows={26}
  //           defaultValue={post.content || ""}
  //           data-original-value={post.content}
  //         />
  //       </div>
  //     </div>
  //     <div className="w-full col-span-12 text-right">
  //       <button
  //         className="ml-auto relative inline-flex items-center justify-center leading-5 no-underline w-full md:w-auto min-w-[130px] space-x-1 text-white bg-primary-500 h-12 px-5 py-3 text-base rounded-xl hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-500/20 tw-accessibility transition-all duration-300"
  //         type="submit"
  //       >
  //         保存
  //       </button>
  //     </div>
  //   </form>
  // );
}
