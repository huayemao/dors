"use client";

import { Table } from "@/app/(content)/data-process/Table";

import { BaseAutocomplete } from "@/components/Base/Autocomplete";
import Prose from "@/components/Base/Prose";
import { ClientOnly } from "@/components/ClientOnly";
import { CopyToClipboard } from "@/components/copy-to-clipboard";
import { withModal } from "@/components/PostEditor/withModal";
import {
  BaseButton,
  BaseCard,
  BaseHeading,
  BaseInput,
  BaseParagraph,
  BaseTextarea,
} from "@glint-ui/react";
import { Settings2Icon } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import {
  HerbalContextProvider,
  useHerbalContext,
  useHerbalDispatch,
} from "./context";
import { selectTextInElements } from "@/lib/client/utils/selectTextInElements";
import { HerbalApiService } from "./api";
import { DEFAULT_START } from "./constants";
import { transformHTML2MDX } from "@/lib/client/utils/transformHTML2MDX";
import { minify } from "@/lib/client/utils/minify";
import { Settings } from "./Settings";

function Editor(props) {
  const routes = createBrowserRouter(
    [
      {
        path: "/",
        element: <Content {...props} />,
        children: [
          {
            path: "settings",
            Component: withModal(Settings, "设置"),
          },
        ],
      },
    ],
    { basename: "/herbal" }
  );

  return <RouterProvider router={routes}></RouterProvider>;
}

const Content = () => {
  const { list } = useHerbalContext();
  const dispatch = useHerbalDispatch();
  const setList = (list) => {
    dispatch({ payload: { list } });
  };
  const [activeId, setId] = useState<string | null>(null);
  const token = localStorage.getItem("token");
  const article = useMemo(() => {
    if (!list?.length) {
      return null;
    }
    return list.find((e) => e.articleId == activeId);
  }, [list, activeId]);

  async function updateContent() {
    const articleEl = document.querySelector("#md-preview article.prose")!;
    const str = minify(start + articleEl.outerHTML + end);
    article.cmsArticleContent.content = str;
    article.content = str;
    return HerbalApiService.updateArticleContent(token, article).then((e) => {
      const index = list.findIndex((e) => e.articleId == activeId);
      list[index] = article;
      setList(list);
    });
  }
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      HerbalApiService.getArticleList(token)
        .then((data) => {
          setList(data.rows);
        })
        .catch((e) => {
          navigate("/settings");
        });
    } else {
      toast("请先登录");
      navigate("/settings");
    }
  }, [token]);

  const [start, setStart] = useState(DEFAULT_START);
  const [end, setEnd] = useState("</div>");

  const html = useMemo(() => {
    const articleContent = article?.cmsArticleContent.content;
    return minifyArticleContent(articleContent, end, start);
  }, [article?.cmsArticleContent.content, end, start]);

  const [markdown, setMarkDown] = useState(html);
  useEffect(() => {
    setHTML(html);
    if (!html) {
      return;
    }
    const md = transformHTML2MDX(html);
    setMarkDown(md);
  }, [article, end, html, start]);

  const [content, setHTML] = useState(html);

  return (
    <>
      <header className="py-3">
        <BaseHeading className="text-center" color="primary" as="h1" size="3xl">
          云南省中药材大数据中心文章格式处理工具
        </BaseHeading>
      </header>
      <main className="w-full p-4 grid grid-cols-2 gap-4">
        <BaseCard className="p-4 space-y-4">
          <div className="py-2 mb-4 border-b">
            <BaseHeading>{article?.title}</BaseHeading>
            <BaseParagraph>{article?.articleId}</BaseParagraph>
          </div>
          <BaseButton
            onClick={() => {
              navigate("./settings");
            }}
          >
            <Settings2Icon></Settings2Icon>
          </BaseButton>
          {content && (
            <div className="relative  border-primary-500 rounded  border p-6 space-y-4">
              <BaseTextarea
                rows={10}
                label="html"
                id=""
                key={activeId}
                value={content}
                onChange={(v) => {
                  setHTML(v);
                }}
              ></BaseTextarea>
              <BaseButton
                size="sm"
                className="absolute right-2 -top-2"
                color="primary"
                onClick={() => {
                  updateContent().then(() => {
                    toast("修改成功");
                  });
                }}
              >
                修改
              </BaseButton>
            </div>
          )}

          <div id="md-preview" className="relative min-h-48">
            <BaseTextarea
              rows={10}
              label="markdown"
              key={activeId + "md"}
              value={markdown}
              onChange={setMarkDown}
            ></BaseTextarea>
            {/* <BaseButton variant="pastel" size="sm" className="top-2 right-2" onClick={() => {
                            selectTextInElements('article.prose')

                        }}>选中内容</BaseButton> */}
            {markdown && (
              <Prose
                content={markdown.replaceAll("<br><", "<br/>")}
                className="prose prose-h2:text-center prose-h2:text-primary-700 !max-w-[80ch] prose-h2:border-l-4 prose-h2:border-primary-500 prose-h2:pl-3  prose-p:indent-8  prose-a:!text-primary-600"
              ></Prose>
            )}
          </div>
        </BaseCard>
        <BaseCard className="p-4">
          {!!list.length && (
            <div className="">
              <BaseAutocomplete
                onChange={(e) => {
                  console.log(e);
                  setId((e as any).articleId);
                }}
                label="选择文章"
                items={list}
                properties={{
                  value: "articleId",
                  label: "title",
                  sublabel: "articleId",
                }}
              ></BaseAutocomplete>
              <BaseHeading weight="normal">预览</BaseHeading>
              <div className="relative py-4">
                <div className="w-full text-right">
                  <BaseButton
                    variant="pastel"
                    size="sm"
                    className="top-0 right-0"
                    onClick={() => {
                      selectTextInElements("div.preview");
                    }}
                  >
                    选中内容
                  </BaseButton>
                </div>
                <div
                  className="preview"
                  dangerouslySetInnerHTML={{ __html: html }}
                ></div>
              </div>
            </div>
          )}
        </BaseCard>
      </main>
      <Outlet />
    </>
  );
};

function minifyArticleContent(content: string, end: string, start: string) {
  let contentTrimmed = content
    ? content?.replace(start, "").replace(end, "")
    : "";
  const index = contentTrimmed.lastIndexOf(end);
  if (contentTrimmed.slice(index) == end) {
    contentTrimmed = contentTrimmed.slice(0, index);
  }
  const origin = contentTrimmed.replace(minify(start), "");
  return origin;
}

export default function Page({ params }) {
  return (
    <ClientOnly>
      <HerbalContextProvider>
        <Editor></Editor>
      </HerbalContextProvider>
    </ClientOnly>
  );
}
