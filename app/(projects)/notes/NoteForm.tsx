"use client";
import { readFromClipboard } from "@/lib/utils";
import {
  BaseButton,
  BaseCard,
  BaseInput,
  BaseSelect,
  BaseTabSlider,
} from "@shuriken-ui/react";
import { DOMAttributes, FC, PropsWithChildren, useMemo, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useEntity, useEntityDispatch } from "../../../contexts/notes";
import { useCloseModal } from "@/lib/client/hooks/useCloseModal";
import { Note } from "./constants";
import { BaseAutocomplete } from "@/components/Base/Autocomplete";
import { useNavigate } from "react-router-dom";
import Prose from "@/components/Base/Prose";
import { HIDDEN_TAGS } from "@/components/Notes/constants";
import { useMediaQuery } from "@uidotdev/usehooks";

export const NoteForm: FC<PropsWithChildren> = ({ children }) => {
  const close = useCloseModal();
  const { currentEntity, entityList, currentCollection } = useEntity();
  const dispatch = useEntityDispatch();
  const navigate = useNavigate();
  const [content, setContent] = useState(currentEntity?.content || "");

  const handleSubmit: DOMAttributes<HTMLFormElement>["onSubmit"] = (e) => {
    e.preventDefault();
    const formEl = e.target as HTMLFormElement;
    const formData = new FormData(formEl);
    const obj = Object.fromEntries(formData.entries());

    const targetItemIndex = entityList?.findIndex(
      (e) => e.id === currentEntity.id
    );
    const isEditing = targetItemIndex != undefined && targetItemIndex != -1;
    const sortIndex = parseInt(obj.sortIndex as string);

    const note = {
      ...currentEntity,
      id: isEditing ? currentEntity.id : Date.now(),

      // @ts-ignore
      ...(obj as Omit<Note, "id">),
      sortIndex,
    };

    const isNewArchive =
      isEditing &&
      HIDDEN_TAGS.some(
        (t) =>
          !entityList[targetItemIndex].tags.includes(t) && note.tags.includes(t)
      );

    dispatch({
      type: "CREATE_OR_UPDATE_ENTITY",
      payload: note,
    });

    if (!isEditing) {
      navigate(`/${currentCollection!.id}/` + note.id, {
        replace: true,
        state: { __NA: {} },
      });
    }

    if (isNewArchive) {
      close();
    } else {
      setTimeout(() => {
        // 给 localstorage 同步
        dispatch({
          type: "SET_ENTITY_MODAL_MODE",
          payload: "view",
        });
      }, 100);
    }
  };

  const allTags = useMemo(
    () =>
      Array.from(
        new Set(entityList.flatMap((e) => e.tags).filter((e) => !!e?.trim()))
      ),
    [entityList]
  );
  const isDeskTop = useMediaQuery("only screen and (min-width : 960px)");
  return (
    <form method="POST" onSubmit={handleSubmit}>
      <div className="ltablet:col-span-6 col-span-12 md:col-span-12">
        <div className="relative w-full bg-white transition-all duration-300 rounded-md">
          <div className="lg:grid lg:grid-cols-12 p-4 md:p-8 gap-4">
            <fieldset className="relative lg:col-span-6">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6 md:col-span-3 hidden">
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
                <div className="col-span-4">
                  <BaseInput
                    key={currentEntity?.id}
                    label="排序优先级"
                    labelFloat
                    size="sm"
                    type="number"
                    id="sortIndex"
                    // @ts-ignore
                    name="sortIndex"
                    defaultValue={currentEntity?.sortIndex || 0}
                  />
                </div>
                <div className="col-span-8">
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
            <div className="col-span-12 mt-4 min-h-72">
              {isDeskTop && (
                <div className="lg:grid grid-cols-2 gap-6">
                  <TextareaAutosize
                    key={currentEntity?.id}
                    id="content"
                    name="content"
                    className="nui-focus border-muted-300 placeholder:text-muted-300 focus:border-muted-300 focus:shadow-muted-300/50 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 dark:focus:shadow-muted-800/50 peer w-full border bg-white font-sans transition-all duration-300 focus:shadow-lg disabled:cursor-not-allowed disabled:opacity-75 min-h-48 text-sm leading-[1.6] rounded resize-none p-2"
                    placeholder="请输入内容"
                    minRows={10}
                    defaultValue={currentEntity?.content || ""}
                    onChange={(e) => {
                      setContent(e.target.value);
                    }}
                  />
                  {/* <div className="bg-muted-50 p-4"> */}
                  <BaseCard shadow="flat" className="px-4 bg-white">
                    <Prose content={content}></Prose>
                  </BaseCard>
                  {/* </div> */}
                </div>
              )}
              {!isDeskTop && (
                <BaseTabSlider
                  size="sm"
                  tabs={[
                    { label: "编辑", value: "edit" },
                    { label: "预览", value: "preview" },
                  ]}
                  defaultValue="edit"
                >
                  {(activeValue) => (
                    <>
                      {activeValue === "edit" && (
                        <TextareaAutosize
                          key={currentEntity?.id}
                          id="content"
                          name="content"
                          className="nui-focus border-muted-300 placeholder:text-muted-300 focus:border-muted-300 focus:shadow-muted-300/50 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 dark:focus:shadow-muted-800/50 peer w-full border bg-white font-sans transition-all duration-300 focus:shadow-lg disabled:cursor-not-allowed disabled:opacity-75 min-h-48 text-sm leading-[1.6] rounded resize-none p-2"
                          placeholder="请输入内容"
                          minRows={10}
                          defaultValue={content}
                          onChange={(e) => {
                            setContent(e.target.value);
                          }}
                        />
                      )}
                      {activeValue === "preview" && (
                        <BaseCard shadow="flat" className="px-4 bg-white">
                          <Prose content={content}></Prose>
                        </BaseCard>
                      )}
                    </>
                  )}
                </BaseTabSlider>
              )}
            </div>
          </div>
        </div>
      </div>
      {children}
    </form>
  );
};
