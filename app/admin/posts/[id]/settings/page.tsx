"use client";
import Button from "@/components/Base/Button";
import Input from "@/components/Base/Input";
import Select from "@/components/Base/Select";
import { CategoriesContext } from "@/contexts/categories";
import { PostContext } from "@/contexts/post";
import { notFound } from "next/navigation";
import { FC, MouseEventHandler, PropsWithChildren, useContext } from "react";

export const dynamic = "force-dynamic";

const Panel: FC<
  PropsWithChildren<{
    title: string;
    description: string;
  }>
> = ({ title, description, children }) => {
  return (
    <div className="nui-card nui-card-curved nui-card-white p-6">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="nui-heading nui-heading-sm nui-weight-semibold nui-lead-tight text-muted-800 dark:text-white">
            <span>{title}</span>
          </h3>
        </div>
        <div>
          <p className="nui-paragraph nui-paragraph-sm nui-weight-normal nui-lead-normal pb-3">
            <span className="text-muted-400">{description}</span>
          </p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default function Page({ params }) {
  const post = useContext(PostContext);

  const cats = useContext(CategoriesContext);
  const categoryId = post?.posts_category_links[0]?.category_id;

  const syncUpdateTime: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    (document.querySelector("#updated_at") as HTMLInputElement).value = (
      document.querySelector("#created_at") as HTMLInputElement
    ).value;
  };

  if (!post) {
    return notFound();
  }
  return (
    <div className="space-y-4 max-w-4xl">
      <Panel title="分类&标签" description="文章可有一个分类和多个标签">
        <Select
          required
          label="分类"
          id="category"
          name="category"
          defaultValue={categoryId ? String(categoryId) : undefined}
          data-original-value={categoryId ? String(categoryId) : undefined}
          data={cats.map((e) => ({
            value: String(e.id),
            label: e.name as string,
          }))}
        />
      </Panel>
      <Panel
        description="修改文章任意属性将默认更新修改时间，可选择自定义修改时间"
        title="创建&修改时间"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            type="datetime-local"
            label="自定义修改时间"
            id={"updated_at"}
            name="updated_at"
            // 不传修改为当前时间
            defaultValue={""}
            data-original-value={""}
          />
          <Input
            type="datetime-local"
            label="自定义创建时间"
            id={"created_at"}
            name="created_at"
            defaultValue={post.created_at?.toISOString().slice(0, 16)}
            data-original-value={post.created_at?.toISOString().slice(0, 16)}
          />
        </div>
        <div className="text-right my-3">
          <Button onClick={syncUpdateTime} size="sm" flavor="pastel">
            修改时间使用创建时间
          </Button>
        </div>
      </Panel>
    </div>
  );
}
