"use client";
import { CategoriesContext } from "@/contexts/categories";
import { getPost } from "@/lib/posts";
import { cn, getDateForDateTimeInput } from "@/lib/utils";
import { Settings, TimerReset } from "lucide-react";
import Link from "next/link";
import { FormEventHandler, useContext, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Button from "./Base/Button";
import Select from "./Base/Select";

export type PostEditorProps = {
  post: Awaited<ReturnType<typeof getPost>>;
};

export const detectChange = (form: HTMLFormElement) => {
  const changedFields = [];
  const formData = new FormData(form);
  const inputs = form.querySelectorAll("input, select, textarea");
  inputs.forEach((el) => {
    // @ts-ignore
    const formDataValue = el.multiple
      ? // @ts-ignore
        formData.getAll(el.name).sort().join(",")
      : // @ts-ignore
        formData.get(el.name);
    // @ts-ignore
    const originalValue = el.dataset.originalValue;
    if (String(originalValue) === String(formDataValue) && el.id !== "id") {
      // @ts-ignore
      el.disabled = true;
    } else {
      // @ts-ignore
      changedFields.push(el.name);
    }
  });

  if (!changedFields.length) {
    inputs.forEach((el) => {
      // @ts-ignore
      el.disabled = false;
    });
    return false;
  }
  return true;
};

const handleOnSubmit: FormEventHandler<HTMLFormElement> = (e) => {
  const changed = detectChange(e.target as HTMLFormElement);
  if (!changed) {
    e.preventDefault();
    alert("尚未修改内容");
  }
};

export function PostEditor({ post }: PostEditorProps) {
  const categories = useContext(CategoriesContext);
  const [reserveUpdateTime, setReserveUpdateTime] = useState(false);

  const [content, setContent] = useState(post?.content || "");

  const categoryId = post?.posts_category_links[0]?.category_id;

  return (
    <form
      className="bg-white dark:bg-black  max-w-screen-lg"
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

      <div className="relative min-h-[500px] w-full border-stone-200 p-12 pt-16 px-8 dark:border-stone-700 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg">
        <div className="absolute right-0 left-0 px-5 top-5 mb-6 flex items-center ">
          <div className="w-20 mr-auto">
            <Select
              size="sm"
              shape="full"
              required
              labelFloat
              label="分类"
              id="category_id"
              name="category_id"
              defaultValue={categoryId ? String(categoryId) : undefined}
              data-original-value={categoryId ? String(categoryId) : undefined}
              data={categories.map((e) => ({
                value: String(e.id),
                label: e.name as string,
              }))}
            />
          </div>
          <div className="space-x-3 flex items-center">
            {post && (
              <>
                <Link
                  href={`/admin/posts/${post.id}/settings`}
                  className="flex items-center space-x-1 text-sm text-stone-400 hover:text-stone-500"
                >
                  <Settings className="h-5 w-5" />
                </Link>
                <label className="text-stone-400 hover:text-stone-500">
                  <TimerReset
                    className={cn("h-5 w-5 ", {
                      "text-primary-500": reserveUpdateTime,
                    })}
                  />
                  <input
                    className="appearance-none m-0 bg-transparent hidden"
                    type="checkbox"
                    onChange={(e) => {
                      setReserveUpdateTime(e.target.checked);
                    }}
                    defaultChecked={reserveUpdateTime}
                  />
                </label>
                <input
                  hidden
                  disabled={!reserveUpdateTime}
                  id="updated_at"
                  name="updated_at"
                  type="datetime-local"
                  defaultValue={getDateForDateTimeInput(
                    post?.updated_at as Date
                  )}
                ></input>
              </>
            )}
            <Button type="submit" size="sm">
              保存
            </Button>
          </div>
        </div>

        <div className="mb-5 flex flex-col space-y-3 border-b border-stone-200 pb-5 dark:border-stone-700">
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
            defaultValue={""}
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

  //       <div className="grid grid-cols-2 gap-4">
  //         <div>

  //         </div>
  //         <div>

  //         </div>
  //       </div>
  //   </form>
  // );
}
