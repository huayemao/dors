"use client";
import Select from "@/components/Base/Select";
import { CategoriesContext } from "@/contexts/categories";
import { PostContext } from "@/contexts/post";
import { useContext } from "react";

export default async function Page({ params }) {
  const post = useContext(PostContext);
  const cats = useContext(CategoriesContext);
  const categoryId = post?.posts_category_links[0]?.category_id;
  return (
    <div>
      <div className="nui-card nui-card-curved nui-card-white p-6">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="nui-heading nui-heading-sm nui-weight-semibold nui-lead-tight text-muted-800 dark:text-white">
              <span>Messages</span>
            </h3>
          </div>
          <div>
            <p className="nui-paragraph nui-paragraph-xs nui-weight-normal nui-lead-normal">
              <span className="text-muted-400">
                You currently have more than 10 unread messages in your inbox.
                It could be a good time to check them out.
              </span>
            </p>
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
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
