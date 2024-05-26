"use client";
import Input from "@/components/Base/Input";
import { ChangeEventHandler, FormEventHandler } from "react";
import { Props } from "./page";

export function TagForm({ id, isEditing, tags }: Props) {
  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (tags.map((e) => e.name).includes(event.target.value)) {
      event.target.setCustomValidity("该标签已存在！");
    } else {
      event.target.setCustomValidity("");
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    const nameInput: HTMLInputElement = (
      event.target as HTMLFormElement
    ).querySelector("#name") as HTMLInputElement;
    if (tags.map((e) => e.name).includes(nameInput.value)) {
      nameInput.setCustomValidity("该标签已存在！");
    } else {
      nameInput.setCustomValidity("");
    }

    const form = event.target as HTMLFormElement;
    form.reportValidity();
    if (!form.checkValidity()) {
      event.preventDefault();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      action={"/api/createTag"}
      method="POST"
      className="w-96 rounded  bg-white p-8 mx-auto space-y-4"
      key={id}
    >
      <input
        name="id"
        id="id"
        readOnly
        hidden
        disabled={!isEditing}
        defaultValue={id}
      />
      <div className="flex items-center gap-4 ">
        <div className="bg-primary-500/20 text-primary-500 flex h-14 w-14 shrink-0 items-center justify-center rounded-full font-sans text-2xl">
          <TagIcon />
        </div>
        <div className="block text-xl font-semibold text-gray-700">
          <h3 className="leading-5 font-heading font-medium text-lg">
            {isEditing ? "编辑" : "新建"}标签
          </h3>
          <p className="text-sm font-normal leading-5 text-muted-400">
            创建新的标签
          </p>
        </div>
      </div>
      <Input
        label="名称"
        id="name"
        required
        defaultValue={tags.find((t) => t.id == id)?.name || ""}
        onChange={handleInputChange}
      />
      <div className="w-full text-right">
        {" "}
        <button
          type="submit"
          className="nui-button nui-button-medium nui-button-curved nui-button-solid nui-button-primary !h-12 w-32"
        >
          确定
        </button>
      </div>
    </form>
  );
}
function TagIcon() {
  return (
    <svg
      data-v-26e5b7b0=""
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      aria-hidden="true"
      role="img"
      className="icon h-5 w-5"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
    >
      <g fill="currentColor">
        <path
          d="M216 48v40H40V48a8 8 0 0 1 8-8h160a8 8 0 0 1 8 8Z"
          opacity=".2"
        ></path>
        <path d="M208 32h-24v-8a8 8 0 0 0-16 0v8H88v-8a8 8 0 0 0-16 0v8H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16ZM72 48v8a8 8 0 0 0 16 0v-8h80v8a8 8 0 0 0 16 0v-8h24v32H48V48Zm136 160H48V96h160v112Z"></path>
      </g>
    </svg>
  );
}
