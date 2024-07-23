import { BaseButton, BaseInputFile } from "@shuriken-ui/react";
import { DOMAttributes } from "react";

type Props = DOMAttributes<HTMLFormElement>;

export function UploadForm(props: Props) {
  return (
    <form
      action="/api/files"
      encType="multipart/form-data"
      method="POST"
      className="w-96 rounded  bg-white p-8 mx-auto space-y-4"
      {...props}
    >
      {/* @ts-ignore */}
      <BaseInputFile multiple label="文件" name="files" id="files"></BaseInputFile>
      {/* @ts-ignore */}
      {/* <BaseInput label="名称" name="filename" id="filename"></BaseInput> */}
      <div className="w-full text-right">
        <BaseButton type="submit" color="primary">
          确定
        </BaseButton>
      </div>
    </form>
  );
}
