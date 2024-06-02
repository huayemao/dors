import Input from "@/components/Base/Input";
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
      <div className="flex items-center gap-4 ">
        <div className="bg-primary-500/20 text-primary-500 flex h-14 w-14 shrink-0 items-center justify-center rounded-full font-sans text-2xl">
          X
        </div>
        <div className="block text-xl font-semibold text-gray-700">
          <h3 className="leading-5 font-heading font-medium text-lg">
            文件上传
          </h3>
          <p className="text-sm font-normal leading-5 text-muted-400">
            文件上传
          </p>
        </div>
      </div>
      <Input label="文件" name="file" type="file" id="file"></Input>
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
