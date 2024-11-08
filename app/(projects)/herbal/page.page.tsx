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
} from "@shuriken-ui/react";
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

export async function getData(token: any) {
  return HerbalApiService.getArticleList(token)
    .then((res) => {
      // todo:这个抽到 service 里面去
      if (res.status == 200) {
        return res.json().then((data) => {
          if (data.code == 200) {
            localStorage.setItem("token", token);
            return data;
          } else {
            throw new Error(data.msg);
          }
        });
      } else {
        throw new Error("网络请求失败");
      }
    })
    .catch((e) => {
      toast(e.message);
      if (localStorage.getItem("token")) {
        localStorage.removeItem("token");
      }
    });
}

async function login(
  username: string,
  password: string,
  uuid: string,
  captcha: string
) {
  return fetch("https://zycdsj.com/prod-api/login", {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      "content-type": "application/json;charset=UTF-8",
      istoken: "false",
      "sec-ch-ua":
        '"Chromium";v="130", "Microsoft Edge";v="130", "Not?A_Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      usertype: "sysUser",
    },
    referrer: "https://zycdsj.com/symanage/login?redirect=%2Findex",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: `{\"username\":\"${username}\",\"password\":\"${password}\",\"code\":\"${captcha}\",\"uuid\":\"${uuid}\"}`,
    method: "POST",
    mode: "cors",
    credentials: "include",
  })
    .then((res) => {
      if (res.status == 200) {
        return new Promise((resolve, reject) => {
          res.json().then((data) => {
            console.log(data);
            if (data.code == 200) {
              localStorage.setItem("token", data.token);
              toast("登录成功");
              resolve(data.token);
            } else {
              reject(data.msg);
            }
          });
        });
      } else {
        throw new Error("网络请求失败");
      }
    })
    .catch((e) => {
      toast(e.message);
    });
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
      getData(token)
        .then((data) => {
          setList(data.rows);
          console.log(list);
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

export function TokenForm({
  onTokenChange,
}: {
  onTokenChange: (token: any) => Promise<void>;
}) {
  const [captchaImage, setCap] = useState<{
    msg: string;
    img: string;
    code: number;
    uuid: string;
  }>();
  const nav = useNavigate();

  useEffect(() => {
    HerbalApiService.getCaptchaImage()
      .then((res) => {
        return res.json();
      })
      .then((d: { msg: string; img: string; code: number; uuid: string }) => {
        setCap(d);
      });
  }, []);

  return (
    <form
      className="grid grid-cols-2 gap-4"
      action=""
      onSubmit={async (e) => {
        e.preventDefault();
        {
          /* @ts-ignore */
        }
        const { token, username, password, captcha } = getInputValues(e);
        if (token) {
          await onTokenChange(token);
        } else {
          const token = await login(
            username,
            password,
            captchaImage!.uuid,
            captcha
          );
          console.log(token);
          await onTokenChange(token);
          nav("/", { replace: true });
        }
      }}
    >
      <fieldset>
        <BaseInput
          // @ts-ignore
          name="token"
          label="token"
          id="token"
          defaultValue={localStorage.getItem("token") || ""}
        ></BaseInput>
        <BaseButton type="submit">确定</BaseButton>
      </fieldset>
      <fieldset className="border rounded p-4 space-y-2">
        {/* @ts-ignore */}
        <BaseInput name="username" label="username" id="username"></BaseInput>
        <BaseInput
          // @ts-ignore
          name="password"
          type="password"
          label="password"
          id="password"
        ></BaseInput>
        <div className="grid grid-cols-2 gap-2 items-center">
          {/*  eslint-disable-next-line @next/next/no-img-element*/}
          <img
            src={
              captchaImage
                ? ((`data:image/gif;base64,` +
                    (captchaImage as any).img) as string)
                : ""
            }
            alt=""
          />
          {/* @ts-ignore */}
          <BaseInput name="captcha" label="captcha" id="captcha"></BaseInput>
          <BaseButton type="submit">确定</BaseButton>
        </div>
      </fieldset>
    </form>
  );

  function getInputValues(e: FormEvent<HTMLFormElement>) {
    const formEl = e.nativeEvent.target as HTMLElement;
    const getInputEl = (selector: string) =>
      (formEl.querySelector(selector) as HTMLInputElement).value;
    const token = getInputEl("input#token");
    const username = getInputEl("input#username");
    const password = getInputEl("input#password");
    const captcha = getInputEl("input#captcha");
    return { token, username, password, captcha };
  }
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
