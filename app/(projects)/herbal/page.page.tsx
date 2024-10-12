"use client"

import { Table } from "@/app/(content)/data-process/Table";
import { BaseAutocomplete } from "@/components/Base/Autocomplete";
import Prose from "@/components/Base/Prose";
import { ClientOnly } from "@/components/ClientOnly";
import { CopyToClipboard } from "@/components/copy-to-clipboard";
import { BaseButton, BaseCard, BaseDropdown, BaseInput, BaseListbox, BaseListboxItem, BaseTextarea } from "@shuriken-ui/react";
import { useEffect, useMemo, useState } from "react";
import { createBrowserRouter } from "react-router-dom";

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




const minify = (str: string) => {
    const regex = /(>)\s+(?=<)/g;
    let minified = str.replace(regex, '$1');
    return minified
}
const Content = () => {
    const [list, setList] = useState<any>()
    const [activeId, setId] = useState<string | null>(null)
    const token = localStorage.getItem('token')
    const article = useMemo(() => {
        if (!list) {
            return null
        }
        return list?.rows && list.rows.find(e => e.articleId == activeId)
    }, [list, activeId])


    function updateContent() {
        const str = minify(start + content + end);
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
        });
    }

    function getData(token: any) {
        fetch("https://zycdsj.com/prod-api/cms/article/list?pageNum=1&pageSize=1000&TimeFrame=", {
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
                localStorage.setItem('token', token);
            }
            else {
                if (localStorage.getItem('token')) {
                    localStorage.removeItem('token');
                }
            }
            return res.json();
        }).then((data) => {
            setList(data);
        });
    }


    useEffect(() => {
        if (token) {
            getData(token)
        }
    }, [])


    useEffect(() => {
        setContent(article?.cmsArticleContent.content)
        setMarkDown(article?.cmsArticleContent.content)
    }, [article])

    const [content, setContent] = useState(article?.cmsArticleContent.content)
    const [markdown, setMarkDown] = useState(article?.cmsArticleContent.content)
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
        </style>
        `)
    const [end, setEnd] = useState("</div>")
    console.log(article)

    return (
        <main className="w-full p-4 grid grid-cols-2 gap-4">
            <BaseCard className="p-4">
                {activeId}
                <BaseTextarea id="start" value={start} onChange={setStart}></BaseTextarea>
                {content && <>
                    <BaseTextarea label="html" id="" key={activeId} value={content} onChange={(v) => {
                        setContent(v)
                    }}></BaseTextarea>
                    <BaseTextarea label="markdown" key={activeId + 'md'} value={markdown} onChange={setMarkDown}></BaseTextarea>

                    <div className="relative">
                        <BaseButton variant="pastel" size="sm" className="top-2 right-2" onClick={() => {
                            selectTextInElements('article.prose')

                        }}>选中内容</BaseButton>
                        <Prose content={markdown.replaceAll('<br><', '<br/>')} className="prose prose-h2:text-center prose-h2:text-green-700 prose-h2:border-l-4 prose-h2:border-green-500 prose-h2:pl-3  prose-p:indent-8  prose-a:!text-green-600"></Prose>
                    </div>
                </>
                }
                <BaseTextarea id="end" value={end} onChange={setEnd}></BaseTextarea>
                <BaseButton color="primary" onClick={() => {
                    updateContent().then(() => {
                    });
                }}>修改</BaseButton>
                <form action="" onSubmit={(e) => {
                    e.preventDefault()
                    {/* @ts-ignore */ }
                    const token = (e.nativeEvent.target as HTMLElement).querySelector('input#token').value;
                    getData(token);
                    // localStorage.setItem('token', token)
                }}>
                    {/* @ts-ignore */}
                    <BaseInput name="token" label="token" id="token" defaultValue={localStorage.getItem('token')}></BaseInput>
                    <BaseButton type="submit">确定</BaseButton>
                </form>
            </BaseCard>
            <BaseCard className="p-4">
                {list?.rows &&
                    <div className="">
                        <BaseAutocomplete
                            onChange={(e) => {
                                console.log(e)
                                setId((e as any).articleId)
                            }}
                            label="文章"
                            items={list.rows}
                            properties={{ value: 'articleId', label: 'title', sublabel: 'description' }}>
                        </BaseAutocomplete>
                        {activeId}
                        <div dangerouslySetInnerHTML={{ __html: article?.cmsArticleContent.content }}></div>
                    </div>
                }
            </BaseCard>
        </main>
    );
}

export default function Page({ params }) {
    return <ClientOnly><Content></Content></ClientOnly>
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


