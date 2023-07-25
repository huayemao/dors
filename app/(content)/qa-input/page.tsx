"use client";
import Input from "@/components/Base/Input";
import Select from "@/components/Base/Select";
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
    cancel();
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

  const cancel = () => {
    // forceUpdate(1);
    setCurrentItemId(0);
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
                      <Select
                        id="type"
                        name="type"
                        label="类型"
                        data={[{ value: "single", label: "单选" }]}
                        defaultValue={"single"}
                      />
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
                          <Select
                            label="答案"
                            id="answer"
                            name="answer"
                            key={currentItem?.id}
                            defaultValue={
                              currentItem?.options.find(
                                (e) => currentItem.answer === e.label
                              )?.label || "A"
                            }
                            data={options.map((e) => ({
                              value: e.label,
                              label: e.label,
                            }))}
                          ></Select>
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
                            defaultValue={currentItem?.solution}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
              <div className="p-4 text-right md:col-span-5">
                <div className=" inline-flex w-full items-center justify-end gap-2 sm:w-auto">
                  <button
                    data-v-71bb21a6
                    type="button"
                    className="is-button rounded is-button-default !h-12 w-full sm:w-40"
                    onClick={(e) => {
                      e.preventDefault();
                      cancel();
                    }}
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="is-button rounded bg-primary-500 dark:bg-primary-500 hover:enabled:bg-primary-400 dark:hover:enabled:bg-primary-400 text-white hover:enabled:shadow-lg hover:enabled:shadow-primary-500/50 dark:hover:enabled:shadow-primary-800/20 focus-visible:outline-primary-400/70 focus-within:outline-primary-400/70 focus-visible:bg-primary-500 active:enabled:bg-primary-500 dark:focus-visible:outline-primary-400 dark:focus-within:outline-primary-400 dark:focus-visible:bg-primary-500 dark:active:enabled:bg-primary-500 !h-12 w-full sm:w-40"
                  >
                    确定
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
                      type="button"
                      onClick={(ev) => {
                        ev.preventDefault();
                        setCurrentItemId(e.id);
                      }}
                    >
                      编辑
                    </button>
                    <button
                      type="button"
                      onClick={(ev) => {
                        ev.preventDefault();
                        removeItem(e.id);
                      }}
                    >
                      删除
                    </button>
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
