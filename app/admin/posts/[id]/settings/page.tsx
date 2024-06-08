"use client";
import Input from "@/components/Base/Input";
import Select from "@/components/Base/Select";
import { detectChange } from "@/components/PostEditor";
import { CategoriesContext } from "@/contexts/categories";
import { PostContext } from "@/contexts/post";
import { TagsContext } from "@/contexts/tags";
import { getPost } from "@/lib/posts";
import { PexelsPhoto } from "@/lib/types/PexelsPhoto";
import { getDateForDateTimeInput } from "@/lib/utils";
import { BaseButton, BaseSelect } from "@shuriken-ui/react";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  FC,
  MouseEventHandler,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

export const dynamic = "force-dynamic";

const Panel: FC<
  PropsWithChildren<{
    title: string;
    description: string;
  }>
> = ({ title, description, children }) => {
  return (
    <div className="nui-card nui-card-curved nui-card-white p-6 max-w-md">
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

const SaveButton = ({ postId }: { postId: string }) => {
  const [loading, setLoading] = useState(false);
  const handleClick = async (e) => {
    const form = (e.nativeEvent.target as HTMLElement)
      .previousElementSibling as HTMLFormElement;
    const hasChanged = detectChange(form);
    if (!hasChanged) {
      alert("没有需要提交的修改");
      return;
    }
    const formData = new FormData(form);
    formData.append("id", postId);
    setLoading(true);
    fetch("/api/updatePost", {
      method: "POST",
      body: formData,
      headers: {
        accept: "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          alert("修改成功");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <BaseButton loading={loading} className="w-full" onClick={handleClick}>
      保存
    </BaseButton>
  );
};

const CoverImageSetting = ({
  originalPhoto,
  postId,
  editTime,
}: {
  originalPhoto: PexelsPhoto;
  postId: string;
  editTime: string;
}) => {
  const [photo, setPhoto] = useState(originalPhoto);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Image
        width={300}
        height={240}
        className="w-full"
        alt={photo.alt}
        src={photo.src.large}
      />
      <div className="text-right mt-2">
        <BaseButton
          loading={loading}
          onClick={() => {
            const formData = new FormData();
            formData.append("id", postId);
            formData.append("changePhoto", "on");
            formData.append("updated_at", editTime);
            setLoading(true);
            fetch("/api/updatePost", {
              method: "POST",
              body: formData,
              headers: {
                accept: "application/json",
              },
            })
              .then((res) => {
                return res.json();
              })
              .then((data) => {
                const post = data.data as Awaited<ReturnType<typeof getPost>>;
                setPhoto(post?.cover_image as PexelsPhoto);
              })
              .finally(() => {
                setLoading(false);
              });
          }}
          size="sm"
          variant="pastel"
        >
          随机更换图片
        </BaseButton>
      </div>
    </>
  );
};

export default function Page({ params }) {
  const post = useContext(PostContext);
  const tags = useContext(TagsContext);

  const cats = useContext(CategoriesContext);
  const categoryId = post?.posts_category_links[0]?.category_id;

  const syncUpdateTime: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    (document.querySelector("#updated_at") as HTMLInputElement).value = (
      document.querySelector("#created_at") as HTMLInputElement
    ).value;
  };

  const useLastEditTime: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    (document.querySelector("#updated_at") as HTMLInputElement).value =
      getDateForDateTimeInput(post?.updated_at as Date);
  };

  if (!post) {
    return notFound();
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
      <Panel title="封面图片" description="可更换为随机图片或自定义图片">
        <CoverImageSetting
          originalPhoto={post.cover_image as PexelsPhoto}
          postId={String(post.id)}
          editTime={getDateForDateTimeInput(post?.updated_at as Date)}
        />
      </Panel>
      <Panel title="分类&标签" description="文章可有一个分类和多个标签">
        <form className="mb-3">
          <BaseSelect
            required
            label="分类"
            id="category_id"
            name="category_id"
            defaultValue={categoryId ? String(categoryId) : undefined}
            data-original-value={categoryId ? String(categoryId) : undefined}
          >
            {cats.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </BaseSelect>
          <Select
            multiple
            label="标签"
            id="tags"
            name="tags"
            defaultValue={post.tags.map((e) => String(e?.name)).sort()}
            data-original-value={post.tags.map((e) => String(e?.name)).sort()}
            data={tags.map((e) => ({
              value: String(e.name),
              label: e.name as string,
            }))}
            className="lg:!h-[180px]"
          />
        </form>
        <SaveButton postId={String(post.id)}></SaveButton>
      </Panel>
      <Panel
        description="修改文章任意属性将默认更新修改时间，可选择自定义修改时间"
        title="创建&修改时间"
      >
        <form>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Input
                type="datetime-local"
                label="自定义修改时间"
                id={"updated_at"}
                name="updated_at"
                // 不传修改为当前时间
                defaultValue={""}
                data-original-value={""}
              />
            </div>
            <div>
              <Input
                type="datetime-local"
                label="自定义创建时间"
                id={"created_at"}
                name="created_at"
                defaultValue={getDateForDateTimeInput(post?.created_at as Date)}
                data-original-value={getDateForDateTimeInput(
                  post?.updated_at as Date
                )}
              />
            </div>
          </div>
          <div className="flex my-3">
            <div className="mr-auto nui-paragraph nui-paragraph-xs text-muted-400">
              快捷自定义修改时间：
            </div>
            <div className="flex flex-col gap-2">
              <BaseButton onClick={useLastEditTime} size="sm" variant="pastel">
                使用上次修改时间
              </BaseButton>
              <BaseButton onClick={syncUpdateTime} size="sm" variant="pastel">
                使用创建时间
              </BaseButton>
            </div>
          </div>
        </form>
        <SaveButton postId={String(post.id)}></SaveButton>
      </Panel>
    </div>
  );
}
