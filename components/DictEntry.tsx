import React from "react";
import Prose from "./Base/Prose";
import { BaseCard } from "@shuriken-ui/react";
import Link from "next/link";

const sampleHtml = `<li class="wordlistentry-row" data-word-id="132033707"><div class="bpb hbr-10 lp-20 lpr-15 lpt-15 lpb-15 lmb-10"><div class="x lmb-10"><div class="hfl"><a class="tb" href="https://dictionary.cambridge.org/zhs/%E8%AF%8D%E5%85%B8/%E8%8B%B1%E8%AF%AD-%E6%B1%89%E8%AF%AD-%E7%AE%80%E4%BD%93/at-the-end-of-the-day"><span class="phrase haxa lmr-10">at the end of the day</span><span class="pos fs14 ti">idiom</span></a></div></div><div class="def fs16 fs18-s fs19-m lmb-10">something that you say before you give the most important fact of a situation</div><div class="trans fs16 fs18-s fs19-m lmb-10 tc-bb">最终;到头来;不管怎么说</div></div></li>`;

export interface DictEntryType {
  wordId: string;
  phrase: string;
  pos: string;
  definition: string;
  translation: string;
  href: string;
}

export function parseDictEntry(html: string): DictEntryType {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const wordId = doc.querySelector("li")?.getAttribute("data-word-id") || "";
  const phrase = doc.querySelector(".phrase")?.textContent || "";
  const pos = doc.querySelector(".pos")?.textContent || "";
  const definition = doc.querySelector(".def")?.textContent || "";
  const translation = doc.querySelector(".trans")?.textContent || "";
  const href = doc.querySelector("a.tb")?.getAttribute("href") || "";

  return {
    wordId,
    phrase,
    pos,
    definition,
    translation,
    href,
  };
}

export function dictEntryToMarkdown(entry: DictEntryType): string {
  return `<a class="font-bold  no-underline" href="${entry.href}"><dt>${entry.phrase} <small class="text-primary-600 font-cursive"></a>&emsp;${entry.pos}</small></dt>
    <dd><i>${entry.definition}</i></dd>
    <dd class="font-sans"><i>${entry.translation}</i></dd>
  `;
}

export default function DictEntry({ entry }: { entry: DictEntryType }) {
  return (
    <BaseCard
      className="p-4 mx-auto my-4"
      dangerouslySetInnerHTML={{ __html: dictEntryToMarkdown(entry) }}
    ></BaseCard>
  ); // 显示短语
}
