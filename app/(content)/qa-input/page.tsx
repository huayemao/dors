"use client";
import Input from "@/components/Base/Input";
import QA from "@/components/Question";
import { useStorageState } from "@/lib/hooks/localstorage";
import { Question } from "@/lib/types/Question";
import { copyToClipboard } from "@/lib/utils/copyToClipboard";
import { DOMAttributes, useState } from "react";

// todo: 允许取消

const DEFAULT_OPTIONS = [
  {
    label: "A",
    value: "",
  },
  {
    label: "B",
    value: "",
  },
  {
    label: "C",
    value: "",
  },
  {
    label: "D",
    value: "",
  },
];

export default function QInput() {
  const [, forceUpdate] = useState(0);

  const { data: collectionList } = useStorageState("collectionList", [
    { id: new Date().toLocaleDateString() },
  ]);

  const { data: itemList, mutate } = useStorageState<Question[]>(
    new Date().toLocaleDateString(),
    []
  );

  const [currentItemId, setCurrentItemId] = useState(0);

  const currentItem = itemList?.find((e) => e.id === currentItemId);
  const maxSeq = itemList?.length
    ? Math.max(...itemList?.map((e) => Number(e.seq)))
    : -1;

  const options = currentItem?.options || DEFAULT_OPTIONS;

  const handleSubmit: DOMAttributes<HTMLFormElement>["onSubmit"] = (e) => {
    e.preventDefault();
    const formEl = e.target as HTMLFormElement;
    const formData = new FormData(formEl);
    const obj = Object.fromEntries(formData.entries()) as Omit<
      Question,
      "options" | "id"
    >;

    for (const key in obj) {
      if (key.startsWith("option-")) {
        const value = obj[key] as string;
        const index = Number(key.replace("option-", ""));
        options[index] = {
          ...options[index],
          value,
        };
      }
    }

    const targetItemIndex = itemList?.findIndex((e) => e.id === currentItemId);
    const isEditing = targetItemIndex != undefined && targetItemIndex != -1;

    const question = {
      id: isEditing ? currentItemId : Date.now(),
      ...obj,
      options,
    };

    if (isEditing) {
      if (!itemList) {
        throw new Error("错误");
      }
      const newList = [...itemList];
      newList[targetItemIndex] = question;
      mutate(newList);
    } else {
      mutate(itemList ? itemList.concat(question) : [question]);
    }

    forceUpdate(1);
  };

  const removeItem = (id: number) => {
    const targetItemIndex = itemList?.findIndex((e) => e.id === id);
    const hasTarget = targetItemIndex != undefined && targetItemIndex != -1;
    if (hasTarget) {
      if (!itemList) {
        throw Error("");
      }
      mutate(itemList?.filter((_, i) => i != targetItemIndex));
    }
  };

  const copy = (e) => {
    e.preventDefault();
    copyToClipboard(JSON.stringify(itemList));
  };

  return (
    <div className="py-4 px-12">
      <form
        method="POST"
        className="grid grid-cols-12 gap-6"
        onSubmit={handleSubmit}
      >
        <div className="ltablet:col-span-6 col-span-12 lg:col-span-6">
          <div className="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative w-full border bg-white transition-all duration-300 rounded-md">
            <div className="ltablet:col-span-9 col-span-12 lg:col-span-9">
              <fieldset className="relative p-4 md:p-8">
                <div className="mb-6">
                  <p className="font-heading text-base font-medium leading-none">
                    题目
                  </p>
                  <p className="font-sans text-xs font-normal leading-normal text-muted-400">
                    录入题目信息
                  </p>
                </div>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-6">
                    <div className="relative">
                      <Input
                        key={currentItem?.id}
                        label="题号"
                        type="number"
                        id="seq"
                        defaultValue={currentItem?.seq || maxSeq + 1}
                      />
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <div className="relative">
                      <label
                        className=" nui-label w-full pb-1 text-[0.825rem]"
                        htmlFor="type"
                      >
                        类型
                      </label>
                      <div className="group/nui-select relative">
                        <select
                          defaultValue={"single"}
                          id="type"
                          name="type"
                          className="pl-10 nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 focus:border-muted-300 focus:shadow-muted-300/50 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-600 dark:focus:border-muted-700 dark:focus:shadow-muted-800/50 peer w-full cursor-pointer appearance-none border bg-white font-sans focus:shadow-lg px-2 pe-9 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded pe-4 ps-9"
                        >
                          <option value="single">单选</option>
                          <option value="multiple">多选</option>
                          <option value="judge">判断</option>
                          <option value="subjective">主管</option>
                        </select>
                        <div className="text-muted-400 group-focus-within/nui-select:text-primary-500 absolute start-0 top-0 flex items-center justify-center transition-colors duration-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-75 h-10 w-10">
                          <svg
                            data-v-cd102a71
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            aria-hidden="true"
                            role="img"
                            className="icon h-[1.15rem] w-[1.15rem]"
                            width="1em"
                            height="1em"
                            viewBox="0 0 256 256"
                          >
                            <g fill="currentColor">
                              <path
                                d="M232 94c0 66-104 122-104 122S24 160 24 94a54 54 0 0 1 54-54c22.59 0 41.94 12.31 50 32c8.06-19.69 27.41-32 50-32a54 54 0 0 1 54 54Z"
                                opacity=".2"
                              />
                              <path d="M72 136H32a8 8 0 0 1 0-16h35.72l13.62-20.44a8 8 0 0 1 13.32 0l25.34 38l9.34-14A8 8 0 0 1 136 120h24a8 8 0 0 1 0 16h-19.72l-13.62 20.44a8 8 0 0 1-13.32 0L88 118.42l-9.34 14A8 8 0 0 1 72 136ZM178 32c-20.65 0-38.73 8.88-50 23.89C116.73 40.88 98.65 32 78 32a62.07 62.07 0 0 0-62 62v2.25a8 8 0 1 0 16-.5V94a46.06 46.06 0 0 1 46-46c19.45 0 35.78 10.36 42.6 27a8 8 0 0 0 14.8 0c6.82-16.67 23.15-27 42.6-27a46.06 46.06 0 0 1 46 46c0 53.61-77.76 102.15-96 112.8c-10.83-6.31-42.63-26-66.68-52.21a8 8 0 1 0-11.8 10.82c31.17 34 72.93 56.68 74.69 57.63a8 8 0 0 0 7.58 0C136.21 220.66 240 164 240 94a62.07 62.07 0 0 0-62-62Z" />
                            </g>
                          </svg>
                        </div>
                        <div className="text-muted-400 pointer-events-none absolute end-0 top-0 flex items-center justify-center transition-transform duration-300 group-focus-within/nui-select:-rotate-180 h-10 w-10">
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                          >
                            <path
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="m6 9 6 6 6-6"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12">
                    <div className="relative">
                      <label
                        htmlFor="content"
                        className="nui-label pb-1 text-[0.825rem]"
                      >
                        问题（文本）
                      </label>
                      <div className="group/nui-textarea relative flex flex-col">
                        <textarea
                          key={currentItem?.id}
                          id="content"
                          name="content"
                          className="nui-focus border-muted-300 placeholder:text-muted-300 focus:border-muted-300 focus:shadow-muted-300/50 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 dark:focus:shadow-muted-800/50 peer w-full border bg-white font-sans transition-all duration-300 focus:shadow-lg disabled:cursor-not-allowed disabled:opacity-75 min-h-[2.5rem] text-sm leading-[1.6] rounded resize-none p-2"
                          placeholder="输入题目文本"
                          rows={3}
                          defaultValue={currentItem?.content || ""}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
              <fieldset className="p-4 md:p-8 bg-muted-50 dark:bg-muted-800/70 border-muted-200 dark:border-muted-700 border-t">
                <div className="grid grid-cols-12 gap-x-8 gap-y-4">
                  {options.map((e, i) => (
                    <div key={e.label} className="col-span-6">
                      <div className="flex items-center gap-4">
                        <Input
                          key={currentItem?.id + e.label}
                          defaultValue={e.value}
                          label={e.label}
                          labelClassName="w-fit"
                          inputContainerClassName="w-full flex-1"
                          type="text"
                          id={"option-" + i}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="col-span-12">
                    <div className="bg-muted-100 dark:bg-muted-700/70 space-y-2 rounded-lg p-4">
                      <div className="w-24 sm:col-span-4">
                        <div className="relative">
                          <label
                            className="nui-label w-full pb-1 text-[0.825rem]"
                            htmlFor="answer"
                          >
                            答案
                          </label>

                          <div className="group/nui-input relative">
                            <select
                              defaultValue={
                                currentItem?.options.find(
                                  (e) => currentItem.answer === e.label
                                )?.label
                              }
                              key={currentItem?.id}
                              id="answer"
                              name="answer"
                              className="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 focus:border-muted-300 focus:shadow-muted-300/50 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-600 dark:focus:border-muted-700 dark:focus:shadow-muted-800/50 peer w-full cursor-pointer appearance-none border bg-white font-sans focus:shadow-lg px-2 pe-9 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded pe-4 ps-9"
                            >
                              {options.map((e) => (
                                <option key={e.label} value={e.label}>
                                  {e.label}
                                </option>
                              ))}
                            </select>
                            <div className="text-muted-400 group-focus-within/nui-select:text-primary-500 absolute start-0 top-0 flex items-center justify-center transition-colors duration-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-75 h-10 w-10">
                              <svg
                                data-v-cd102a71
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                aria-hidden="true"
                                role="img"
                                className="icon h-[1.15rem] w-[1.15rem]"
                                width="1em"
                                height="1em"
                                viewBox="0 0 256 256"
                              >
                                <g fill="currentColor">
                                  <path
                                    d="M200 56v55.1c0 39.7-31.75 72.6-71.45 72.9A72 72 0 0 1 56 112V56a8 8 0 0 1 8-8h128a8 8 0 0 1 8 8Z"
                                    opacity=".2"
                                  />
                                  <path d="M232 64h-24v-8a16 16 0 0 0-16-16H64a16 16 0 0 0-16 16v8H24A16 16 0 0 0 8 80v16a40 40 0 0 0 40 40h3.65A80.13 80.13 0 0 0 120 191.61V216H96a8 8 0 0 0 0 16h64a8 8 0 0 0 0-16h-24v-24.42c31.94-3.23 58.44-25.64 68.08-55.58H208a40 40 0 0 0 40-40V80a16 16 0 0 0-16-16ZM48 120a24 24 0 0 1-24-24V80h24v32q0 4 .39 8Zm144-8.9c0 35.52-28.49 64.64-63.51 64.9H128a64 64 0 0 1-64-64V56h128ZM232 96a24 24 0 0 1-24 24h-.5a81.81 81.81 0 0 0 .5-8.9V80h24Z" />
                                </g>
                              </svg>
                            </div>
                            <div className="text-muted-400 pointer-events-none absolute end-0 top-0 flex items-center justify-center transition-transform duration-300 group-focus-within/nui-select:-rotate-180 h-10 w-10">
                              <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                className="h-4 w-4"
                              >
                                <path
                                  fill="none"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="m6 9 6 6 6-6"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-12 relative">
                        <label
                          htmlFor="solution"
                          className="nui-label pb-1 text-[0.825rem]"
                        >
                          解答
                        </label>
                        <div className="group/nui-textarea relative flex flex-col">
                          <textarea
                            key={currentItem?.id}
                            id="solution"
                            name="solution"
                            className="nui-focus border-muted-300 placeholder:text-muted-300 focus:border-muted-300 focus:shadow-muted-300/50 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 dark:focus:shadow-muted-800/50 peer w-full border bg-white font-sans transition-all duration-300 focus:shadow-lg disabled:cursor-not-allowed disabled:opacity-75 min-h-[2.5rem] text-sm leading-[1.6] rounded resize-none p-2"
                            placeholder="Ex: General Orthopedic Surgery, Foot & Ankle Surgery"
                            rows={3}
                            defaultValue={""}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
              <div className="text-right md:col-span-5">
                <div className="-mt-4 inline-flex w-full items-center justify-end gap-2 sm:w-auto">
                  <button
                    data-v-71bb21a6
                    type="button"
                    className="is-button rounded is-button-default !h-12 w-full sm:w-40"
                  >
                    {" "}
                    Cancel{" "}
                  </button>
                  <button
                    type="submit"
                    className="is-button rounded bg-primary-500 dark:bg-primary-500 hover:enabled:bg-primary-400 dark:hover:enabled:bg-primary-400 text-white hover:enabled:shadow-lg hover:enabled:shadow-primary-500/50 dark:hover:enabled:shadow-primary-800/20 focus-visible:outline-primary-400/70 focus-within:outline-primary-400/70 focus-visible:bg-primary-500 active:enabled:bg-primary-500 dark:focus-visible:outline-primary-400 dark:focus-within:outline-primary-400 dark:focus-visible:bg-primary-500 dark:active:enabled:bg-primary-500 !h-12 w-full sm:w-40"
                  >
                    {" "}
                    确定{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ltablet:col-span-6 col-span-12 lg:col-span-6">
          <div className="prose space-y-4 border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative w-full border bg-white transition-all duration-300 rounded-md ptablet:p-8 p-6 lg:p-8">
            {itemList?.map((e, i, arr) => (
              <div key={i}>
                <div className="relative">
                  <QA data={e} preview />
                  <div className="absolute bottom-4 right-4 space-x-2">
                    <button
                      onClick={(ev) => {
                        ev.preventDefault();
                        setCurrentItemId(e.id);
                      }}
                    >
                      编辑
                    </button>
                    <button onClick={() => removeItem(e.id)}>删除</button>
                  </div>
                </div>
                {i !== arr.length - 1 && <hr />}
              </div>
            ))}
          </div>
          <div className="prose space-y-4 border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative w-full border bg-white transition-all duration-300 rounded-md ptablet:p-8 p-6 lg:p-8">
            <button onClick={copy}>复制</button>
          </div>
        </div>
      </form>
    </div>
  );
}
