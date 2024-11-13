"use client";
import { readFromClipboard } from "@/lib/utils";
import { BaseButton, BaseInput, BaseSelect } from "@shuriken-ui/react";
import { DOMAttributes, FC, PropsWithChildren, useMemo, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useEntity, useEntityDispatch } from "../../../contexts/notes";
import { useCloseModal } from "@/lib/client/utils/useCloseModal";
import { Note } from "./constants";
import { BaseAutocomplete } from "@/components/Base/Autocomplete";
import { useNavigate } from "react-router-dom";

export const NoteForm: FC<PropsWithChildren> = ({ children }) => {
  const close = useCloseModal();
  const { currentEntity, entityList, currentCollection } = useEntity();
  const dispatch = useEntityDispatch();
  const navigate = useNavigate();

  const handleSubmit: DOMAttributes<HTMLFormElement>["onSubmit"] = (e) => {
    e.preventDefault();
    const formEl = e.target as HTMLFormElement;
    const formData = new FormData(formEl);
    const obj = Object.fromEntries(formData.entries());

    const targetItemIndex = entityList?.findIndex(
      (e) => e.id === currentEntity.id
    );
    const isEditing = targetItemIndex != undefined && targetItemIndex != -1;

    const note = {
      ...currentEntity,
      id: isEditing ? currentEntity.id : Date.now(),
      // @ts-ignore
      ...(obj as Omit<Note, "id">),
    };

    if (isEditing) {
      if (!entityList) {
        throw new Error("错误");
      }
      const newList = [...entityList];
      newList[targetItemIndex] = note;
      // todo: 改成 editQuestion
      dispatch({ type: "SET_ENTITY_LIST", payload: newList });
    } else {
      // todo: 改成 addQuestion
      dispatch({
        type: "SET_ENTITY_LIST",
        payload: entityList ? entityList.concat(note) : [note],
      });
    }
    dispatch({
      type: "SET_CURRENT_ENTITY",
      payload: note,
    });

    if (!isEditing) {
      navigate(`/${currentCollection!.id}/` + note.id, {
        replace: true,
        state: { __NA: {} },
      });
    }

    setTimeout(() => {
      // 给 localstorage 同步
      dispatch({
        type: "SET_ENTITY_MODAL_MODE",
        payload: "view",
      });
    }, 100);
  };

  const allTags = useMemo(
    () =>
      Array.from(
        new Set(entityList.flatMap((e) => e.tags).filter((e) => !!e?.trim()))
      ),
    [entityList]
  );

  return (
    <form method="POST" onSubmit={handleSubmit}>
      <div className="ltablet:col-span-6 col-span-12 lg:col-span-7">
        <div className="relative w-full bg-white transition-all duration-300 rounded-md">
          <div className="lg:grid lg:grid-cols-12 p-4 md:p-8 gap-4">
            <fieldset className="relative lg:col-span-7 ">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6 hidden">
                  <div className="relative">
                    <BaseInput
                      key={currentEntity?.id}
                      label="序号"
                      type="number"
                      id="seq"
                      // @ts-ignore
                      name="seq"
                      defaultValue={currentEntity?.seq}
                    />
                  </div>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <div className="relative">
                    <BaseAutocomplete
                      labelFloat
                      size="sm"
                      dropdown
                      multiple
                      allowCreate
                      label="标签"
                      items={allTags}
                      onChange={(v: string[]) => {
                        dispatch({
                          type: "SET_CURRENT_ENTITY",
                          payload: { ...currentEntity, tags: v },
                        });
                      }}
                      value={currentEntity.tags || []}
                      rounded="md"
                      icon="lucide:tag"
                      placeholder="搜索..."
                    ></BaseAutocomplete>
                  </div>
                </div>
              </div>
            </fieldset>
            <div className="col-span-12">
              <div className="relative">
                <label
                  htmlFor="content"
                  className="nui-label pb-1 text-[0.825rem]"
                >
                  内容
                </label>
                <div className="group/nui-textarea relative flex flex-col">
                  <TextareaAutosize
                    key={currentEntity?.id}
                    id="content"
                    name="content"
                    className="nui-focus border-muted-300 placeholder:text-muted-300 focus:border-muted-300 focus:shadow-muted-300/50 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 dark:focus:shadow-muted-800/50 peer w-full border bg-white font-sans transition-all duration-300 focus:shadow-lg disabled:cursor-not-allowed disabled:opacity-75 min-h-[2.5rem] text-sm leading-[1.6] rounded resize-none p-2"
                    placeholder="请输入内容"
                    minRows={10}
                    defaultValue={currentEntity?.content || ""}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {children}
    </form>
  );
};
