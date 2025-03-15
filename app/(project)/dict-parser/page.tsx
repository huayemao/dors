"use client";
import DictEntry, {
  parseDictEntry,
  DictEntryType,
} from "@/components/DictEntry";
import Prose from "@/components/Base/Prose";
import { useState } from "react";
import toast from "react-hot-toast";
import { BaseTabs,BaseButton,BaseTextarea } from "@shuriken-ui/react";
import { Panel } from "@/components/Base/Panel";

export default function DictParserPage() {
  const [parsedEntry, setParsedEntry] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<any>(null);

  return (
    <div className="w-full bg-slate-100">
      <div className="lg:max-w-7xl mx-auto p-4 md:p-6 ">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">字典条目解析器</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* 输入区域 */}
          <Panel title="输入" description="请输入需要解析的HTML文本" className="!bg-transparent !border-none !max-w-full">
            <BaseTextarea
              id="htmlInput"
              className="w-full h-40 p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="请输入HTML文本..."
            />
            <BaseButton
              color="primary"
              onClick={() => {
                const input = (document.getElementById("htmlInput") as HTMLTextAreaElement).value;
                try {
                  const result = parseDictEntry(input);
                  const mdx = `<DictEntry entry={${JSON.stringify(result, null, 2)}}/>`;
                  setParsedEntry(mdx);
                  setParsedResult(result);
                } catch (error) {
                  toast.error("解析失败：" + error);
                }
              }}
            >
              解析
            </BaseButton>
          </Panel>

          {parsedEntry && (
            <Panel title="预览" className="!bg-transparent !border-none !max-w-full">
              <Prose content={parsedEntry} />
            </Panel>
          )}
        </div>

        {/* 输出区域 */}
        {parsedResult && (
          <Panel title="输出结果" className="max-w-none mt-6">
            <BaseTabs
              defaultValue="json"
              tabs={[
                { label: "JSON", value: "json" },
                { label: "MDX", value: "mdx" },
              ]}
            >
              {(activeValue) => (
                <div className="mt-2">
                  {activeValue === "json" && (
                    <div>
                      <h2 className="text-lg font-semibold mb-3 text-gray-700">JSON 输出：</h2>
                      <Prose content={`\`\`\`json\n${JSON.stringify(parsedResult, null, 2)}\n\`\`\``} />
                    </div>
                  )}
                  {activeValue === "mdx" && (
                    <div>
                      <h2 className="text-lg font-semibold mb-3 text-gray-700">MDX 标记：</h2>
                      <Prose content={`\`\`\`mdx\n${parsedEntry}\n\`\`\``} />
                    </div>
                  )}
                </div>
              )}
            </BaseTabs>
          </Panel>
        )}
      </div>
    </div>
  );
}
