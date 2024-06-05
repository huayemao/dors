"use client";
import Select from "@/components/Base/Select";
import QA from "@/components/Question";
import { useStorageState } from "@/lib/hooks/localstorage";
import { Question } from "@/lib/types/Question";
import { readFromClipboard } from "@/lib/utils";
import { copyToClipboard } from "@/lib/utils/copyToClipboard";
import { DOMAttributes, useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

import {
  BaseButton,
  BaseButtonIcon,
  BaseCard,
  BaseInput,
  BaseSelect,
} from "@shuriken-ui/react";
import { CopyIcon, Edit2, ImportIcon, PlusIcon, Trash } from "lucide-react";
import { Modal } from "../../../components/Base/Modal";

function withConfirm<T extends Function>(fn: T) {
  const res = confirm("确定吗？");
  if (!res) {
    return;
  }
  fn();
}

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

const DEFAULT_ITEM = {
  seq: "0",
  id: Date.now(),
  content: "",
  type: "single",
  solution: "",
  answer: "A",
  options: ["A", "B", "C", "D"].map((e) => ({
    label: e,
    value: "",
  })),
};

export default function QInput() {
  const [, forceUpdate] = useState(0);

  let [isOpen, setIsOpen] = useState(false);
  let [mode, setMode] = useState<"view" | "edit">("view");

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  const { data: collectionList } = useStorageState("collectionList", [
    { id: new Date().toLocaleDateString() },
  ]);

  const { data: itemList, mutate } = useStorageState<Question[]>(
    new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString(),
    []
  );

  const [currentItem, setCurrentItem] = useState<Question>(DEFAULT_ITEM);

  useEffect(() => {
    const maxSeq = itemList?.length
      ? Math.max(...itemList?.map((e) => Number(e.seq)))
      : -1;
    setCurrentItem((prev) => {
      return {
        ...prev,
        seq: String(maxSeq + 1),
      };
    });
  }, [itemList?.length]);

  const options = currentItem?.options || DEFAULT_OPTIONS;

  const handleSubmit: DOMAttributes<HTMLFormElement>["onSubmit"] = (e) => {
    e.preventDefault();
    const formEl = e.target as HTMLFormElement;
    const formData = new FormData(formEl);
    const obj = Object.fromEntries(formData.entries()) as Omit<
      Question,
      "options" | "id"
    >;
    obj.answer = formData.getAll("answer").join("");

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

    const targetItemIndex = itemList?.findIndex((e) => e.id === currentItem.id);
    const isEditing = targetItemIndex != undefined && targetItemIndex != -1;

    const question = {
      id: isEditing ? currentItem.id : Date.now(),
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

  function cancel() {
    // forceUpdate(1);
    setCurrentItem(DEFAULT_ITEM);
    setMode("view");
    close();
  }

  const importQuestionsFromClipBoard = () => {
    readFromClipboard().then((text) => {
      try {
        const obj = JSON.parse(text);
        if (obj[0].id) {
          mutate(obj);
          alert("导入成功");
        }
      } catch (error) {
        alert("数据导入错误：" + error.message);
      }
    });
  };

  const copy = (e) => {
    e.preventDefault();
    copyToClipboard(`<QuestionList  data={${JSON.stringify(itemList)}}/>`);
    alert("已复制到剪贴板");
  };

  const handlePasteInput = async () => {
    /* @ts-ignore */
    const inputString = await readFromClipboard();

    const regex = /([A-D])([,:.、])(.*)/g;
    const options: Question["options"] = [];

    let match;
    while ((match = regex.exec(inputString)) !== null) {
      const option = {
        label: match[1],
        value: match[3],
      };
      options.push(option);
    }

    if (options.length < 3) {
      alert("识别的选项数目：" + options.length);
      return;
    }

    setCurrentItem((prev) => {
      return {
        ...prev,
        options,
      };
    });

    alert("自动解析成功");
  };

  return (
    <div className="pt-24 md:px-12">
      <div className="space-x-4 border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative w-full border border-b-0 rounded-b-none  bg-white transition-all duration-300 rounded-md p-6">
        <BaseButton onClick={copy}>
          <CopyIcon className="me-2 h-4 w-4"></CopyIcon>
          复制
        </BaseButton>
        <BaseButton size="md" onClick={importQuestionsFromClipBoard}>
          <ImportIcon className="me-2 h-4 w-4"></ImportIcon>
          导入
        </BaseButton>
        <BaseButton
          onClick={() => {
            open();
            setMode("edit");
          }}
        >
          <PlusIcon className="me-2 h-4 w-4"></PlusIcon>
          新建
        </BaseButton>
      </div>
      <div className="col-span-12">
        <div className="bg-slate-50 relative w-full border transition-all duration-300 rounded-md ptablet:p-8 p-6 lg:p-8">
          <div className="max-w-full  masonry sn:masonry-sm md:masonry-md">
            {itemList?.map((e, i, arr) => (
              <BaseCard
                rounded="md"
                key={i}
                className=" break-inside-avoid my-3 p-4"
                onClick={() => {
                  setCurrentItem(e);
                  open();
                }}
              >
                <div className="relative">
                  <QA preview data={e} />
                  {/* <div className="space-x-2 text-right">
                    </div> */}
                </div>
              </BaseCard>
            ))}
          </div>
        </div>
      </div>
      <Modal
        open={isOpen}
        onClose={cancel}
        title={
          <>
            {"题目"} {currentItem.seq}
          </>
        }
        actions={
          <>
            {mode == "view" ? (
              <>
                <BaseButtonIcon
                  rounded="md"
                  size="sm"
                  onClick={() => {
                    setMode("edit");
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </BaseButtonIcon>
                <BaseButtonIcon
                  rounded="md"
                  size="sm"
                  onClick={() => {
                    withConfirm(() => {
                      removeItem(currentItem.id);
                      cancel();
                    });
                  }}
                >
                  <Trash className="h-4 w-4" />
                </BaseButtonIcon>
              </>
            ) : null}
          </>
        }
      >
        {mode == "view" ? (
          <>
            <div className="p-8 flex justify-center w-full ">
              <QA data={currentItem} />
            </div>
          </>
        ) : (
          newFunction()
        )}
      </Modal>
    </div>
  );

  function newFunction() {
    return (
      <form method="POST" onSubmit={handleSubmit}>
        <div className="ltablet:col-span-6 col-span-12 lg:col-span-7">
          <div className="relative w-full bg-white transition-all duration-300 rounded-md">
            <div className="lg:grid border rounded lg:grid-cols-12 max-h-[76vh] overflow-y-auto">
              <fieldset className="relative p-4 md:p-8 lg:col-span-7">
                {/* <div className="mb-6">
                  <p className="font-heading text-base font-medium leading-none">
                    题目
                  </p>
                  <p className="font-sans text-xs font-normal leading-normal text-muted-400">
                    录入题目信息
                  </p>
                </div> */}
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-6">
                    <div className="relative">
                      <BaseInput
                        key={currentItem?.id}
                        label="题号"
                        type="number"
                        id="seq"
                        defaultValue={currentItem?.seq}
                      />
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <div className="relative">
                      <BaseSelect
                        id="type"
                        name="type"
                        label="类型"
                        defaultValue={"single"}
                      >
                        {[{ value: "single", label: "单选" }].map((e) => (
                          <option key={e.value}>{e.label}</option>
                        ))}
                      </BaseSelect>
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
                        <TextareaAutosize
                          key={currentItem?.id}
                          id="content"
                          name="content"
                          className="nui-focus border-muted-300 placeholder:text-muted-300 focus:border-muted-300 focus:shadow-muted-300/50 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 dark:focus:shadow-muted-800/50 peer w-full border bg-white font-sans transition-all duration-300 focus:shadow-lg disabled:cursor-not-allowed disabled:opacity-75 min-h-[2.5rem] text-sm leading-[1.6] rounded resize-none p-2"
                          placeholder="输入题目文本"
                          minRows={4}
                          defaultValue={currentItem?.content || ""}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
              <fieldset className="lg:col-span-5 p-4 md:p-8  dark:border-muted-700">
                <div className="grid grid-cols-12 md:gap-x-8 gap-y-5 border-muted-200 dark:border-muted-700 dark:bg-muted-800 ">
                  {options.map((e, i) => (
                    <div key={e.label} className="col-span-12">
                      <BaseInput
                        classes={{
                          wrapper: "w-full",
                        }}
                        labelFloat
                        key={currentItem?.id + e.label}
                        defaultValue={e.value}
                        label={e.label}
                        type="text"
                        id={"option-" + i}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4 relative text-right">
                  <BaseButton
                    data-nui-tooltip="格式 /([A-D])([,:.、])(.*)/g"
                    size="sm"
                    variant="pastel"
                    type="button"
                    onClick={handlePasteInput}
                  >
                    自动识别选项
                  </BaseButton>
                </div>
              </fieldset>
              <fieldset className="bg-muted-100 dark:bg-muted-700/70 col-span-12">
                <div className=" space-y-2 rounded-lg p-8">
                  <div className="w-48 sm:col-span-4">
                    <div className="relative">
                      <Select
                        size="lg"
                        multiple
                        label="答案"
                        id="answer"
                        name="answer"
                        key={currentItem?.id}
                        /* @ts-ignore */
                        defaultValue={currentItem?.options
                          .filter((e) => currentItem.answer.includes(e.label))
                          .map((e) => e.label)}
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
                      <TextareaAutosize
                        key={currentItem?.id}
                        id="solution"
                        name="solution"
                        className="nui-focus border-muted-300 placeholder:text-muted-300 focus:border-muted-300 focus:shadow-muted-300/50 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 dark:focus:shadow-muted-800/50 peer w-full border bg-white font-sans transition-all duration-300 focus:shadow-lg disabled:cursor-not-allowed disabled:opacity-75 min-h-[2.5rem] text-sm leading-[1.6] rounded p-2"
                        placeholder=""
                        minRows={2}
                        defaultValue={currentItem?.solution}
                      />
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
            <div className="flex w-full items-center gap-x-2 justify-end">
              <div className="p-4 md:p-6">
                <div className="flex gap-x-2">
                  <BaseButton
                    onClick={(e) => {
                      e.preventDefault();
                      close();
                    }}
                    type="button"
                  >
                    取消
                  </BaseButton>
                  <BaseButton
                    type="submit"
                    variant="solid"
                    color="primary"
                    size="md"
                  >
                    {" "}
                    确定
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}
