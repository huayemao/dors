"use client";
import { readFromClipboard } from "@/lib/utils";
import { BaseButton, BaseInput, BaseSelect } from "@glint-ui/react";
import { DOMAttributes, FC, PropsWithChildren, useMemo, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useCloseModal } from "@/lib/client/hooks/useCloseModal";
import { BaseAutocomplete } from "@/components/Base/Autocomplete";
import { useNavigate } from "react-router-dom";
import { EntityContextProvider, useEntity, useEntityDispatch } from "./context";
import { pick } from "lodash";
import toast from "react-hot-toast";
import { ClientOnly } from "@/components/ClientOnly";



export const CategoryForm: FC<PropsWithChildren> = ({ children }) => {
  const close = useCloseModal();
  const { currentEntity, entityList } = useEntity();
  const dispatch = useEntityDispatch();
  const navigate = useNavigate();

  const targetItemIndex = entityList?.findIndex(
    (e) => e.id === currentEntity.id
  );
  const isEditing = targetItemIndex != undefined && targetItemIndex != -1;

  const handleSubmit: DOMAttributes<HTMLFormElement>["onSubmit"] = (e) => {
    e.preventDefault();
    const formEl = e.target as HTMLFormElement;
    const formData = new FormData(formEl);
    const obj = Object.fromEntries(formData.entries());

    const meta =
      obj.description || obj.icon
        ? {
          description: obj.description,
          icon: obj.icon,
        }
        : undefined;

    console.log(obj, isEditing, currentEntity);
    const item = {
      ...currentEntity,
      id: isEditing ? currentEntity.id : Date.now(),
      // @ts-ignore
      ...(obj as Omit<Note, "id", "description", "icon">),
      meta,
    };

    if (isEditing) {
      if (!entityList) {
        throw new Error("错误");
      }
      fetch(`/api/categories/${currentEntity.id}`, {
        method: "PUT",
        body: JSON.stringify(pick(item, ["name", "meta"])),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((obj) => {
          dispatch({
            type: "CREATE_OR_UPDATE_ENTITY",
            payload: obj.data,
          });
          toast("更新成功");
          close();
        });
    } else {
      fetch("/api/categories", {
        method: "POST",
        body: JSON.stringify(pick(item, ["name", "meta"])),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((obj) => {
          dispatch({
            type: "CREATE_OR_UPDATE_ENTITY",
            payload: obj.data,
          });
          toast("创建成功");
          close();
        });
    }
  };

  const { description, icon } = currentEntity?.meta || {};

  return (
    <form method="POST" onSubmit={handleSubmit}>
      <div className="ltablet:col-span-6 col-span-12 lg:col-span-7">
        <div className="relative w-full bg-white transition-all duration-300 rounded-md">
          <div className="lg:grid lg:grid-cols-12 p-4 md:p-8 gap-4">
            <fieldset className="relative lg:col-span-7 ">
              <div className="grid grid-cols-12 gap-4">
                {isEditing && (
                  <div className="col-span-12 md:col-span-6 hidden">
                    <div className="relative">
                      <BaseInput
                        key={currentEntity?.id}
                        label="id"
                        type="number"
                        id="id"
                        // @ts-ignore
                        name="id"
                        defaultValue={currentEntity?.id}
                      />
                    </div>
                  </div>
                )}
                <div className="col-span-12 md:col-span-6">
                  <div className="relative">
                    <BaseInput
                      key={currentEntity?.name}
                      label="名称"
                      id="name"
                      // @ts-ignore
                      name="name"
                      defaultValue={currentEntity?.name || ""}
                    />
                  </div>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <div className="relative">
                    <BaseInput
                      key={icon}
                      label="Icon"
                      id="icon"
                      // @ts-ignore
                      name="icon"
                      defaultValue={icon || ""}
                    />
                  </div>
                </div>
              </div>
            </fieldset>
            <div className="col-span-12">
              <div className="relative">
                <label
                  htmlFor="description"
                  className="nui-label pb-1 text-[0.825rem]"
                >
                  描述
                </label>
                <div className="group/nui-textarea relative flex flex-col">
                  <TextareaAutosize
                    key={currentEntity?.id}
                    id="description"
                    name="description"
                    className="nui-focus border-muted-300 placeholder:text-muted-300 focus:border-muted-300 focus:shadow-muted-300/50 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 dark:focus:shadow-muted-800/50 peer w-full border bg-white font-sans transition-all duration-300 focus:shadow-lg disabled:cursor-not-allowed disabled:opacity-75 min-h-[2.5rem] text-sm leading-[1.6] rounded resize-none p-2"
                    placeholder="请输入内容"
                    minRows={10}
                    defaultValue={description || ""}
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
