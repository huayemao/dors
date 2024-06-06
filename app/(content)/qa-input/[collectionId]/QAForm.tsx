"use client";
import Select from "@/components/Base/Select";
import { Question } from "@/lib/types/Question";
import { readFromClipboard } from "@/lib/utils";
import { BaseButton, BaseInput, BaseSelect } from "@shuriken-ui/react";
import { DOMAttributes } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { DEFAULT_OPTIONS } from "../constants";
import { useQAs, useQAsDispatch } from "../contexts";

export function QAForm() {
  const { questionModalMode, currentQuestion, questionList } = useQAs();
  const dispatch = useQAsDispatch();
  const options = currentQuestion?.options || DEFAULT_OPTIONS;

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

    const targetItemIndex = questionList?.findIndex(
      (e) => e.id === currentQuestion.id
    );
    const isEditing = targetItemIndex != undefined && targetItemIndex != -1;

    const question = {
      id: isEditing ? currentQuestion.id : Date.now(),
      ...obj,
      options,
    };

    if (isEditing) {
      if (!questionList) {
        throw new Error("错误");
      }
      const newList = [...questionList];
      newList[targetItemIndex] = question;
      // todo: 改成 editQuestion
      dispatch({ type: "SET_QUESTION_LIST", payload: newList });
    } else {
      // todo: 改成 addQuestion
      dispatch({
        type: "SET_QUESTION_LIST",
        payload: questionList ? questionList.concat(question) : [question],
      });
    }
    dispatch({ type: "CANCEL" });
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
    dispatch({
      type: "SET_CURRENT_QUESTION",
      payload: {
        ...currentQuestion,
        options,
      },
    });

    alert("自动解析成功");
  };
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
                      key={currentQuestion?.id}
                      label="题号"
                      type="number"
                      id="seq"
                      // @ts-ignore
                      name="seq"
                      defaultValue={currentQuestion?.seq}
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
                        key={currentQuestion?.id}
                        id="content"
                        name="content"
                        className="nui-focus border-muted-300 placeholder:text-muted-300 focus:border-muted-300 focus:shadow-muted-300/50 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 dark:focus:shadow-muted-800/50 peer w-full border bg-white font-sans transition-all duration-300 focus:shadow-lg disabled:cursor-not-allowed disabled:opacity-75 min-h-[2.5rem] text-sm leading-[1.6] rounded resize-none p-2"
                        placeholder="输入题目文本"
                        minRows={4}
                        defaultValue={currentQuestion?.content || ""}
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
                      key={currentQuestion?.id + e.label}
                      defaultValue={e.value}
                      label={e.label}
                      type="text"
                      // @ts-ignore
                      name={"option-" + i}
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
                      key={currentQuestion?.id}
                      /* @ts-ignore */
                      defaultValue={currentQuestion?.options
                        .filter((e) => currentQuestion.answer.includes(e.label))
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
                      key={currentQuestion?.id}
                      id="solution"
                      name="solution"
                      className="nui-focus border-muted-300 placeholder:text-muted-300 focus:border-muted-300 focus:shadow-muted-300/50 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 dark:focus:shadow-muted-800/50 peer w-full border bg-white font-sans transition-all duration-300 focus:shadow-lg disabled:cursor-not-allowed disabled:opacity-75 min-h-[2.5rem] text-sm leading-[1.6] rounded p-2"
                      placeholder=""
                      minRows={2}
                      defaultValue={currentQuestion?.solution}
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
