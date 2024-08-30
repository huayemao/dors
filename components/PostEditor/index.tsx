"use client";
import { Link, RouterProvider, createBrowserRouter, useNavigate } from "react-router-dom";
import { CategoriesContext } from "@/contexts/categories";
import { getPost } from "@/lib/posts";
import { cn, copyTextToClipboard, getDateForDateTimeInput } from "@/lib/utils";
import {
  BaseButtonIcon,
  BaseDropdown,
  BaseDropdownItem,
  BaseSelect,
} from "@shuriken-ui/react";
import { Lock, Plus, Save, Settings, TimerReset } from "lucide-react";
import {
  FormEventHandler,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useReducer,
  FC,
} from "react";
import { Modal } from "../Base/Modal";
import { EmojiPanel } from "../EmojiPanel";
import CollectionEditor from "../Collection/CollectionEditor";
import { UploadPanel } from "./UploadPanel";
import SettingsComponent from "./Settings";
import { useCloseModal } from "@/lib/client/utils/useCloseModal";

const DEFAULT_CATEGORY_ID = 3;


function withModal<Props>(Comp: FC<Props>, title: string, modalOpen: boolean, setModalOpen: (v) => void) {
  return (props) => {
    const close = useCloseModal()
    useEffect(() => {
      setModalOpen(true)
      return () => {
        setModalOpen(false)
      };
    }, []);

    return <Modal
      title={title}
      open={modalOpen}
      onClose={close}
    >
      <Comp {...props} />
    </Modal>
  }
}

export default function (props: PostEditorProps) {

  const [modalOpen, setModalOpen] = useState(false);

  const routes = createBrowserRouter([
    {
      path: "/",
      element: <PostEditorContent {...props} />,
    },
    {
      path: 'settings',
      Component: withModal(SettingsComponent, '设置', modalOpen, setModalOpen),
    },
    {
      path: 'upload',
      Component: withModal(UploadPanel, '文件', modalOpen, setModalOpen),
    },
    {
      path: 'emoji',
      Component: withModal(EmojiPanel, '常用表情符号', modalOpen, setModalOpen),
    },
  ], { basename: props.basePath })

  return <RouterProvider router={routes}></RouterProvider>
}



export type PostEditorProps = {
  post: Awaited<ReturnType<typeof getPost>>;
  mdxContent?: any;
  basePath: string,
};

export const detectChange = (form: HTMLFormElement) => {
  const changedFields = [];
  const formData = new FormData(form);
  const inputs = Array.from(
    form.querySelectorAll("input, select, textarea")
  ) as (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)[];
  // .concat(
  //   Array.from(
  //     topE.querySelectorAll(
  //       "input[form='post_form'], select[form='post_form'], textarea[form='post_form']"
  //     )
  //   )
  // );

  inputs.forEach((el) => {
    // @ts-ignore
    const formDataValue = el.multiple
      ? // @ts-ignore
      formData.getAll(el.name).sort().join(",")
      : // @ts-ignore
      formData.get(el.name);
    // @ts-ignore
    const originalValue = el.dataset.originalValue;

    if (
      el.id == "id" ||
      el.name == "updated_at" ||
      (el as HTMLInputElement).disabled
    ) {
    } else if (
      String(originalValue) === String(formDataValue) ||
      !(el as HTMLInputElement).name
    ) {
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
  window.removeEventListener("beforeunload", handleOnBeforeUnload);
};

export function PostEditorContent({ post, mdxContent }: PostEditorProps) {
  const nav = useNavigate()
  const categories = useContext(CategoriesContext);
  const [reserveUpdateTime, setReserveUpdateTime] = useState(false);
  const [isProtected, setProtected] = useState(post?.protected || false);
  const [content, setContent] = useState(post?.content || "");
  const [pinned, setPinned] = useState(false);

  const categoryId = post?.posts_category_links[0]?.category_id;

  useEffect(() => {
    const el = document.querySelector(".toolbox") as HTMLDivElement;
    const observer = new IntersectionObserver(
      ([e]) => {
        setPinned(e.intersectionRatio < 1);
      },
      { threshold: [1] }
    );
    observer.observe(el);

    window.addEventListener("beforeunload", handleOnBeforeUnload);

    return () => {
      observer.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    // @ts-ignore
    document.querySelector(".grow-wrap")!.dataset.replicatedValue = content;
  }, [content]);

  const [, forceUpdate] = useReducer((bool) => !bool, false);

  const contentRef = useRef<HTMLTextAreaElement>(null);

  return (
    <form
      id="post_form"
      action={post ? "/api/updatePost" : "/api/createPost"}
      method="POST"
      onSubmit={handleOnSubmit}
    >
      <div
        className={cn(
          "toolbox sticky right-0 left-0 top-[-1px] pt-2 mb-4  transition-all max-w-screen-lg",
          { "p-4": pinned }
        )}
      >
        <div
          className={cn("flex items-center transition-all", {
            "nui-card nui-card-shadow nui-card-rounded-md px-4 py-2 bg-white":
              pinned,
          })}
        >
          <div className="flex gap-2 mr-auto">

            <SelectWithName label="分类"
              defaultValue={categoryId ? String(categoryId) : String(DEFAULT_CATEGORY_ID)}
              name="category_id" data={categories.map(e => ({ value: e.id, label: e.name! }))}></SelectWithName>
            <SelectWithName label="分类" defaultValue={post!.type || 'normal'} name="type" data={[
              {
                label: '普通', value: 'normal'
              },
              {
                label: '收藏夹', value: 'collection'
              },
            ]}></SelectWithName>
            <label className="text-stone-400 hover:text-stone-500">
              <BaseButtonIcon
                rounded="md"
                size="sm"
                color={isProtected ? "primary" : "default"}
                onClick={() => {
                  setProtected((v) => !v);
                }}
              >
                <Lock className={cn("h-4 w-4 cursor-pointer")} />
              </BaseButtonIcon>
              <input
                form="post_form"
                id="protected"
                name="protected"
                className="appearance-none m-0 bg-transparent hidden"
                // type="checkbox"
                // defaultChecked={post?.protected}
                checked={isProtected}
                data-original-value={post?.protected ? "on" : "off"}
                value={isProtected ? "on" : "off"}
              />
            </label>
          </div>
          <Action />
        </div>
      </div>
      <div className="bg-white dark:bg-black  max-w-screen-lg overflow-x-hidden">
        {post && (
          <input
            hidden
            name="id"
            id="id"
            defaultValue={post.id}
            data-original-value={post.id}
          />
        )}

        <div className="w-full border-stone-200 p-8 md:p-12 md:pt-16 px-4 md:px-8 dark:border-stone-700  xs:rounded-lg xs:border shadow-lg">
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
              id="excerpt"
              name="excerpt"
              data-original-value={post?.excerpt || ""}
              defaultValue={post?.excerpt || ""}
              className="dark:placeholder-text-600 w-full resize-none border-none px-0 placeholder:text-stone-400 focus:outline-none focus:ring-0 dark:bg-black dark:text-white"
            />
          </div>
          {post?.type == "collection" && (
            <CollectionEditor
              markdown={content}
              onChange={(v) => {
                setContent(v);
                // console.log(contentRef.current?.value);
                if (contentRef.current) {
                  // @ts-ignore
                  contentRef.current.parentNode!.dataset.replicatedValue = v;
                  forceUpdate();
                  // contentRef.current.value = v;
                }
                console.log(v);
              }}
            ></CollectionEditor>
          )}
          {/* todo: 参考这个 https://tailwindcss.com/docs/content */}
          <div className="grow-wrap">
            <textarea
              id="content"
              name="content"
              onChange={(e) => {
                const thisEl = e.nativeEvent.target as HTMLTextAreaElement;
                // @ts-ignore
                thisEl.parentNode!.dataset.replicatedValue = thisEl.value;
                forceUpdate();
              }}
              onInput={(e) => {
                setContent(e.currentTarget.value);
                const thisEl = e.nativeEvent.target as HTMLTextAreaElement;
                // @ts-ignore
                thisEl.parentNode!.dataset.replicatedValue = thisEl.value;
              }}
              value={content}
              data-original-value={post?.content}
              placeholder="正文"
              className="w-full rounded dark:bg-black dark:text-white border-none px-0 dark:placeholder-text-600 placeholder:text-stone-400 focus:outline-none focus:ring-none"
            />
          </div>
        </div>
      </div>

      {mdxContent}
    </form>
  );

  function Action() {
    return (
      <div className="space-x-2 flex items-center">
        <BaseDropdown
          renderButton={() => (
            <BaseButtonIcon rounded="md" size="sm">
              <Plus className="h-4 w-4" />
            </BaseButtonIcon>
          )}
        >
          <BaseDropdownItem
            onClick={() => nav('./upload')}
            title="上传文件"
          ></BaseDropdownItem>
          <BaseDropdownItem
            onClick={() => nav('./emoji')}

            title="Unicode 表情"
          />
        </BaseDropdown>
        {post && (
          <>
            <Link
              to={`./settings`}
              className="flex items-center space-x-1 text-sm text-stone-400 hover:text-stone-500"
            >
              <BaseButtonIcon rounded="md" size="sm">
                <Settings className="h-4 w-4" />
              </BaseButtonIcon>
            </Link>
            <label className="text-stone-400 hover:text-stone-500">
              <BaseButtonIcon
                onClick={() => setReserveUpdateTime((v) => !v)}
                rounded="md"
                size="sm"
                color={reserveUpdateTime ? "primary" : "default"}
              >
                <TimerReset className={cn("h-4 w-4 cursor-pointer", {})} />
              </BaseButtonIcon>
              <input
                hidden
                form="post_form"
                disabled={!reserveUpdateTime}
                id="updated_at"
                name="updated_at"
                type="datetime-local"
                data-original-value={getDateForDateTimeInput(
                  post?.updated_at as Date
                )}
                defaultValue={getDateForDateTimeInput(post?.updated_at as Date)}
              ></input>
            </label>
          </>
        )}
        {/* @ts-ignore */}
        <BaseButtonIcon rounded="md" type="submit" form="post_form" size="sm">
          <Save className="h-4 w-4" />
        </BaseButtonIcon>
      </div>
    );
  }


  function SelectWithName(
    { name, label, defaultValue, data }
      : { name: string, label: string, defaultValue: string | number, data: { label: string; value: string | number }[] }) {
    const [v, setV] = useState(
      defaultValue
    );
    return (
      <div className="w-16">
        <BaseSelect
          size="sm"
          required
          labelFloat
          label={label}
          onChange={(v) => {
            (
              document.querySelector(`input#${name}`) as HTMLInputElement
            ).value = v;
            setV(v);
          }}
          value={v}
        >
          {data.map((e) => (
            <option key={e.value} defaultChecked={e.value == defaultValue} value={e.value}>
              {e.label}
            </option>
          ))}
        </BaseSelect>
        <input
          className="hidden"
          name={name}
          id={name}
          data-original-value={defaultValue || undefined}
          defaultValue={v}
        ></input>
      </div>
    );
  }






}
function handleOnBeforeUnload(event: BeforeUnloadEvent) {
  // Cancel the event as stated by the standard.
  event.preventDefault();
  // Chrome requires returnValue to be set.
  event.returnValue = true;
}


