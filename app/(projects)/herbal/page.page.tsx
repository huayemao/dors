"use client"

import { Table } from "@/app/(content)/data-process/Table";
import { BaseAutocomplete } from "@/components/Base/Autocomplete";
import Prose from "@/components/Base/Prose";
import { ClientOnly } from "@/components/ClientOnly";
import { CopyToClipboard } from "@/components/copy-to-clipboard";
import { withModal } from "@/components/PostEditor/withModal";
import { BaseButton, BaseCard, BaseDropdown, BaseHeading, BaseInput, BaseListbox, BaseListboxItem, BaseParagraph, BaseTextarea } from "@shuriken-ui/react";
import { Settings2Icon } from "lucide-react";
import { Metadata } from "next";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { createBrowserRouter, Outlet, RouterProvider, useNavigate, useNavigation } from "react-router-dom";
import { HerbalContextProvider, useHerbalContext, useHerbalDispatch } from "./context";


// 函数：选中页面上所有匹配的元素的文本内容
function selectTextInElements(selector) {
    // 获取所有匹配的元素
    var elements = document.querySelectorAll(selector);
    var range = document.createRange();
    var selection = window.getSelection();

    // 遍历所有匹配的元素
    elements.forEach(function (element) {
        // 创建一个新的选择范围
        range.selectNodeContents(element);
        // 清除之前的选择并添加新的选择范围
        // @ts-ignore
        selection.removeAllRanges();
        // @ts-ignore
        selection.addRange(range);
    });
}


function Editor(props) {
    const routes = createBrowserRouter(
        [
            {
                path: "/",
                element: <Content {...props} />,
                children: [
                    {
                        path: "settings",
                        Component: withModal(
                            Settings,
                            "设置",
                        ),
                    },
                ]
            },

        ],
        { basename: '/herbal' }
    );

    return <RouterProvider router={routes}></RouterProvider>;
}

async function getData(token: any) {
    return fetch("https://zycdsj.com/prod-api/cms/article/list?pageNum=1&pageSize=1000&TimeFrame=", {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "authorization": token,
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Microsoft Edge\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "usertype": "sysUser"
        },
        "referrer": "https://zycdsj.com/symanage/cms/article",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    }).then(res => {
        if (res.status == 200) {
            return res.json().then(data => {
                if (data.code == 200) {
                    localStorage.setItem('token', token);
                    return data
                }
                else {
                    throw new Error(data.msg)
                }
            })
        }
        else {
            throw new Error("网络请求失败")
        }
    }).catch(e => {
        toast(e.message)
        if (localStorage.getItem('token')) {
            localStorage.removeItem('token');
        }
    });
}

async function login(username: string, password: string, uuid: string, captcha: string) {
    return fetch("https://zycdsj.com/prod-api/login", {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "content-type": "application/json;charset=UTF-8",
            "istoken": "false",
            "sec-ch-ua": "\"Chromium\";v=\"130\", \"Microsoft Edge\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "usertype": "sysUser"
        },
        "referrer": "https://zycdsj.com/symanage/login?redirect=%2Findex",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `{\"username\":\"${username}\",\"password\":\"${password}\",\"code\":\"${captcha}\",\"uuid\":\"${uuid}\"}`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(res => {
        if (res.status == 200) {
            return new Promise((resolve, reject) => {
                res.json().then(data => {
                    console.log(data)
                    if (data.code == 200) {
                        localStorage.setItem('token', data.token);
                        toast("登录成功")
                        resolve(data.token)
                    }
                    else {
                        reject(data.msg)
                    }
                })
            })
        }
        else {
            throw new Error("网络请求失败")
        }
    }).catch(e => {
        toast(e.message)
    });
}


function Settings(params) {
    const { list } = useHerbalContext()
    const dispatch = useHerbalDispatch()
    return <div>
        {/* <BaseTextarea id="start" value={start} onChange={setStart}></BaseTextarea>
        <BaseTextarea id="end" value={end} onChange={setEnd}></BaseTextarea> */}
        <TokenForm onTokenChange={async (token) => {
            return getData(token).then(data => {
                dispatch({ payload: { list: data.rows } })
            })
        }}></TokenForm>
    </div>
}

const minify = (str: string) => {
    const regex = /(>)\s+(?=<)/g;
    let minified = str.replace(regex, '$1');
    return minified
}
const Content = () => {
    const { list } = useHerbalContext()
    const dispatch = useHerbalDispatch();
    const setList = (list) => {
        dispatch({ payload: list })
    }
    const [activeId, setId] = useState<string | null>(null)
    const token = localStorage.getItem('token')
    const article = useMemo(() => {
        if (!list) {
            return null
        }
        return list && list.find(e => e.articleId == activeId)
    }, [list, activeId])


    async function updateContent() {
        const articleEl = document.querySelector('#md-preview article.prose')!
        const str = minify(start + articleEl.outerHTML + end);
        article.cmsArticleContent.content = str;
        article.content = str;
        return fetch("https://zycdsj.com/prod-api/cms/article", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "authorization": token!,
                "cache-control": "no-cache",
                "content-type": "application/json;charset=UTF-8",
                "pragma": "no-cache",
                "sec-ch-ua": "\"Microsoft Edge\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "usertype": "sysUser"
            },
            "referrer": "https://zycdsj.com/symanage/cms/article",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify(article),
            "method": "PUT",
            "mode": "cors",
            "credentials": "include"
        }).then((e => {
            const index = list.findIndex(e => e.articleId == activeId)
            console.log(index, article.cmsArticleContent.content)
            console.log(contentTrimed)
            setList((l) => {
                l[index] = article;
                return l
            })
        }));
    }




    useEffect(() => {
        if (token) {
            getData(token).then((data) => {
                setList(data);
            })
        }
        else {
            toast("请先登录")
            navigate('/settings')
        }
    }, [])




    const [start, setStart] = useState(`<div style="max-width: 80ch;margin: 0 auto;">
        <style>
        .ql-editor ul > li::marker{color:rgb(209, 213, 219)}
        .ql-editor ol > li::marker{color:rgb(107, 114, 128)}
        .ql-editor li:before{display:none} 
        .ql-editor ol {
            list-style-type: decimal; 
        }
        .ql-editor ol>li {
            list-style-type: decimal;
        }
        .ql-editor ul>li {
            list-style-type: disc;
        }
        .article-detail{max-width:90ch;margin:0 auto;}


        article {  
    line-height:1.5;
    font-family:var(--font-sans),ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
}  
body { 
/* CSS Variables that may have been missed get put on body */ 
    --tw-space-y-reverse:  0;  
    --tw-prose-body:  #374151;  
    --tw-prose-headings:  #111827;  
    --tw-border-opacity:  1;  
    --tw-text-opacity:  1;  
} 

* { 
    box-sizing: border-box; 
    border: 0 solid #e5e7eb;
} 

* { 
    box-sizing: border-box;
} 

.space-y-4 > :not([hidden]) ~ :not([hidden]) { 
    --tw-space-y-reverse: 0; 
    margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse))); 
    margin-bottom: calc(1rem * var(--tw-space-y-reverse));
} 





.prose { 
    color: var(--tw-prose-body); 
} 

.prose { 
    --tw-prose-body: #374151; 
    --tw-prose-links: #111827; 
    --tw-prose-hr: #e5e7eb; 
    --tw-prose-captions: #6b7280; 
    font-size: 1rem; 
    line-height: 1.75;
} 

@media (min-width: 1025px){ 
  .prose.lg\\:prose-xl { 
    font-size: 1.25rem; 
    line-height: 1.8;
  } 
}     


.overflow-hidden { 
    overflow: hidden;
} 

.py-6 { 
    padding-top: 1.5rem; 
    padding-bottom: 1.5rem;
} 


*,:after,:before { 
    box-sizing: border-box; 
    border: 0 solid #e5e7eb;
} 

p { 
    margin: 0;
} 

article.prose :where(p):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    margin-top: 1.25em; 
    margin-bottom: 1.25em;
} 

article.prose :where(.prose > :first-child):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    margin-top: 0;
} 

@media (min-width: 1025px){ 
  .lg\\:prose-xl :where(p):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    margin-top: 1.2em; 
    margin-bottom: 1.2em;
  } 

  .lg\\:prose-xl :where(.lg\:prose-xl > :first-child):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    margin-top: 0;
  } 
}     

.prose-p\\:indent-8 :is(:where(p):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *)))  { 
    text-indent: 2rem;
} 

blockquote { 
    margin: 0;
} 

article.prose :where(blockquote):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    font-weight: 500; 
    font-style: italic; 
    color: var(--tw-prose-quotes); 
    border-inline-start-width: .25rem; 
    border-inline-start-color: var(--tw-prose-quote-borders); 
    quotes: "“" "„"; 
    margin-top: 1.6em; 
    margin-bottom: 1.6em; 
    padding-inline-start: 1em;
} 

article.prose :where(ul, ol, blockquote, figure):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    -moz-column-break-inside: avoid; 
    break-inside: avoid;
} 

article.prose :where(blockquote):not(:where([class ~ ="not-prose"] *))  { 
    font-size: 1.1rem; 
    margin-top: 1rem; 
    border-radius: .25rem; 
    border-left-width: 0; 
    background-color: rgba(240,253,244,.6); 
    padding: 1.5rem; 
    line-height: 1.4; 
    --tw-text-opacity: 1; 
    color: rgb(71 85 105/var(--tw-text-opacity)); 
    --tw-drop-shadow: drop-shadow(0 1px 1px rgba(0,0,0,.05)); 
    filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
} 

@media (min-width: 1025px){ 
  .lg\\:prose-xl :where(blockquote):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    margin-top: 1.6em; 
    margin-bottom: 1.6em; 
    padding-inline-start: 1.0666667em;
  } 
}     

h2 { 
    font-size: inherit; 
    font-weight: inherit;
} 

h2 { 
    margin: 0;
} 

h2 { 
    scroll-margin-top: 80px;
} 

article.prose :where(h2):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    color: var(--tw-prose-headings); 
    font-weight: 700; 
    font-size: 1.5em; 
    margin-top: 2em; 
    margin-bottom: 1em; 
    line-height: 1.3333333;
} 

@media (min-width: 1025px){ 
  .lg\\:prose-xl :where(h2):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    font-size: 1.8em; 
    margin-top: 1.5555556em; 
    margin-bottom: .8888889em; 
    line-height: 1.1111111;
  } 
}     

article.prose-h2\\:border-l-4 :is(:where(h2):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *)))  { 
    border-left-width: 4px;
} 

article.prose-h2\\:border-green-500 :is(:where(h2):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *)))  { 
    --tw-border-opacity: 1; 
    border-color: rgb(34 197 94/var(--tw-border-opacity));
} 

article.prose-h2\\:pl-3 :is(:where(h2):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *)))  { 
    padding-left: .75rem;
} 

article.prose-h2\\:text-center :is(:where(h2):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *)))  { 
    text-align: center;
} 

article.prose-h2\\:text-green-700 :is(:where(h2):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *)))  { 
    --tw-text-opacity: 1; 
    color: rgb(21 128 61/var(--tw-text-opacity));
} 

article.prose :where(h2 + *):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    margin-top: 0;
} 

@media (min-width: 1025px){ 
  .lg\\:prose-xl :where(h2 + *):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    margin-top: 0;
  } 
}     

article.prose :where(.prose > :last-child):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    margin-bottom: 0;
} 

@media (min-width: 1025px){ 
  .lg\\:prose-xl :where(.lg\\:prose-xl > :last-child):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    margin-bottom: 0;
  } 
}     

hr { 
    height: 0; 
    color: inherit; 
    border-top-width: 1px;
} 

hr { 
    margin: 0;
} 

a { 
    text-decoration: inherit;
} 

a { 
    color: inherit; 
    text-decoration: none;
} 

:where(a):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    color: var(--tw-prose-links); 
    text-decoration: underline; 
    font-weight: 500;
} 

article.prose-a\\:\\!text-green-600 :is(:where(a):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *)))  { 
    --tw-text-opacity: 1!important; 
    color: rgb(22 163 74/var(--tw-text-opacity))!important;
} 


:where(hr):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    border-color: var(--tw-prose-hr); 
    border-top-width: 1px; 
    margin-top: 3em; 
    margin-bottom: 3em;
} 

@media (min-width: 1025px){ 
  .lg\\:prose-xl :where(hr):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    margin-top: 2.8em; 
    margin-bottom: 2.8em;
  } 
}     

:where(hr + *):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    margin-top: 0;
} 

:where(.prose > :last-child):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    margin-bottom: 0;
} 

@media (min-width: 1025px){ 
  .lg\\:prose-xl :where(hr + *):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    margin-top: 0;
  } 

  .lg\\:prose-xl :where(.lg\\:prose-xl > :last-child):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    margin-bottom: 0;
  } 
}     

</style>`);
    const [end, setEnd] = useState("</div>")
    const html = article?.cmsArticleContent.content
    const contentTrimed = html ? html?.replace(start, "").replace(end, '') : ""
    const [markdown, setMarkDown] = useState(contentTrimed)
    useEffect(() => {
        setContent(contentTrimed)
        setMarkDown(contentTrimed)
    }, [article])
    const [content, setContent] = useState(contentTrimed)
    console.log(article)
    const navigate = useNavigate();
    return (
        <>
            <header className="py-3"><BaseHeading className="text-center" color="primary" as="h1" size="3xl">云南省中药材大数据中心文章格式处理工具</BaseHeading></header>
            <main className="w-full p-4 grid grid-cols-2 gap-4">
                <BaseCard className="p-4 space-y-4">
                    <div className="py-2 mb-4 border-b">
                        <BaseHeading>
                            {article?.title}
                        </BaseHeading>
                        <BaseParagraph>{article?.articleId}</BaseParagraph>
                    </div>
                    <BaseButton onClick={() => {
                        navigate('./settings')
                    }}><Settings2Icon></Settings2Icon>
                    </BaseButton>
                    {content && <div className="relative  border-primary-500 rounded  border p-6 space-y-4">
                        <BaseTextarea rows={10} label="html" id="" key={activeId} value={content} onChange={(v) => {
                            setContent(v)
                        }}></BaseTextarea>
                        <BaseButton size="sm" className="absolute right-2 -top-2" color="primary" onClick={() => {
                            updateContent().then(() => {
                                toast("修改成功")
                            });
                        }}>修改</BaseButton>
                    </div>
                    }

                    <div id="md-preview" className="relative min-h-48">
                        <BaseTextarea rows={10} label="markdown" key={activeId + 'md'} value={markdown} onChange={setMarkDown}></BaseTextarea>
                        {/* <BaseButton variant="pastel" size="sm" className="top-2 right-2" onClick={() => {
                            selectTextInElements('article.prose')

                        }}>选中内容</BaseButton> */}
                        {markdown &&
                            <Prose content={markdown.replaceAll('<br><', '<br/>')} className="prose prose-h2:text-center prose-h2:text-green-700 !max-w-[80ch] prose-h2:border-l-4 prose-h2:border-green-500 prose-h2:pl-3  prose-p:indent-8  prose-a:!text-green-600"></Prose>
                        }
                    </div>

                </BaseCard>
                <BaseCard className="p-4">
                    {!!list.length &&
                        <div className="">
                            <BaseAutocomplete
                                onChange={(e) => {
                                    console.log(e)
                                    setId((e as any).articleId)
                                }}
                                label="选择文章"
                                items={list}
                                properties={{ value: 'articleId', label: 'title', sublabel: 'articleId' }}>
                            </BaseAutocomplete>
                            <BaseHeading weight="normal">预览</BaseHeading>
                            <div className="relative py-4">
                                <div className="w-full text-right">
                                    <BaseButton variant="pastel" size="sm" className="top-0 right-0" onClick={() => {
                                        selectTextInElements('div.preview')

                                    }}>选中内容</BaseButton>
                                </div>
                                <div className="preview" dangerouslySetInnerHTML={{ __html: contentTrimed }}></div>
                            </div>
                        </div>
                    }
                </BaseCard>
            </main>
            <Outlet />
        </>
    );
}

function TokenForm({ onTokenChange }: { onTokenChange: (token: any) => Promise<void> }) {
    const [captchaImage, setCap] = useState<{
        "msg": string;
        "img": string; "code": number;
        "uuid": string
    }>()
    const nav = useNavigate()

    useEffect(() => {
        fetch("https://zycdsj.com/prod-api/captchaImage", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "istoken": "false",
                "sec-ch-ua": "\"Chromium\";v=\"130\", \"Microsoft Edge\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "usertype": "sysUser"
            },
            "referrer": "https://zycdsj.com/symanage/login?redirect=%2Findex",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then(res => {
            return res.json()
        }).then((d: {
            "msg": string;
            "img": string; "code": number;
            "uuid": string
        }) => {
            setCap(d)
        });
    }, [])

    return <form className="grid grid-cols-2 gap-4" action="" onSubmit={async (e) => {
        e.preventDefault();
        { /* @ts-ignore */ }
        const token = (e.nativeEvent.target as HTMLElement).querySelector('input#token').value;
        { /* @ts-ignore */ }
        const username = (e.nativeEvent.target as HTMLElement).querySelector('input#username').value;
        { /* @ts-ignore */ }
        const password = (e.nativeEvent.target as HTMLElement).querySelector('input#password').value;
        { /* @ts-ignore */ }
        const captcha = (e.nativeEvent.target as HTMLElement).querySelector('input#captcha').value;
        if (token) {
            await onTokenChange(token);
        }
        else {
            const token = await login(username, password, captchaImage!.uuid, captcha)
            console.log(token)
            await onTokenChange(token)
            nav('/', { replace: true })
        }
    }}>
        <fieldset>
            {/* @ts-ignore */}
            <BaseInput name="token" label="token" id="token" defaultValue={localStorage.getItem('token')}></BaseInput>
            <BaseButton type="submit">确定</BaseButton>
        </fieldset>
        <fieldset className="border rounded p-4 space-y-2">
            {/* @ts-ignore */}
            <BaseInput name="username" label="username" id="username" ></BaseInput>
            {/* @ts-ignore */}
            <BaseInput name="password" type="password" label="password" id="password" ></BaseInput>
            <div className="grid grid-cols-2 gap-2 items-center">
                <img src={captchaImage ? `data:image/gif;base64,` + (captchaImage as any).img as string : ""} alt="" />
                {/* @ts-ignore */}
                <BaseInput name="captcha" label="captcha" id="captcha" ></BaseInput>
                <BaseButton type="submit">确定</BaseButton>
            </div>
        </fieldset>

    </form >;
}

export default function Page({ params }) {
    return <ClientOnly><HerbalContextProvider><Editor></Editor></HerbalContextProvider></ClientOnly>
}




// // 定义一个函数来过滤并更新内联样式
// function filterAndApplyInlineStyles(element) {
//     // 获取元素的内联样式
//     const inlineStyles = element.style;
//     if (element.getAttribute('style')) {
//         element.setAttribute('style', element.getAttribute('style').replaceAll('var(--tw-text-opacity)', 1).replaceAll('var(--tw-border-opacity)', 1))
//         const newStyle = element.getAttribute('style').split(";").filter(e => {
//             const keyName = e.split(";")[0].trim()
//             return !keyName.startsWith("--tw") || ['--tw-text-opacity', '--tw-border-opacity'].includes(keyName)

//         }).join(";")
//         element.setAttribute('style', newStyle)

//         // 获取计算后的样式
//         const computedStyles = window.getComputedStyle(element);

//         // 遍历内联样式
//         for (let i = 0; i < inlineStyles.length; i++) {
//             const styleName = inlineStyles[i];
//             // 检查计算后的样式中是否存在该属性
//             if (!styleName.startsWith('--tw') && !computedStyles[styleName]) {
//                 // 如果不存在，从内联样式中删除该属性
//                 element.style.removeProperty(styleName);
//                 console.log(element, styleName)
//             }
//         }
//     }
// }

// // 定义一个函数来遍历所有元素并过滤样式
// function filterAllElements() {
//     // 获取文档中的所有元素
//     const allElements = document.getElementsByTagName("*");

//     // 遍历所有元素
//     for (let i = 0; i < allElements.length; i++) {
//         const element = allElements[i];
//         // 过滤并更新内联样式
//         filterAndApplyInlineStyles(element);
//     }
// }

// // 调用函数来过滤并更新所有元素的内联样式
// filterAllElements();


// document.querySelectorAll('*').forEach(e=>{
//     e.style.removeProperty('margin-top');
//     e.style.removeProperty('margin-bottom');
//     e.style.removeProperty('padding-top');
//     e.style.removeProperty('padding-bottom');
// })


