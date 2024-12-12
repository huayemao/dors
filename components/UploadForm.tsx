"use client";
import {
  BaseButton,
  BaseInputFile,
  BaseProgress,
  useNinjaFilePreview,
} from "@shuriken-ui/react";
import {
  Attributes,
  ComponentProps,
  DOMAttributes,
  FC,
  Fragment,
  useCallback,
  useState,
} from "react";
import { BaseInputFileHeadless } from "./Base/InputFileHeadless";
import { CloudIcon, SlashIcon, UploadIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { Icon, IconProps } from "@iconify/react/dist/iconify.js";
import toast from "react-hot-toast";
import { copyTextToClipboard } from "@/lib/utils";

type Props = DOMAttributes<HTMLFormElement>;
const Iconify: FC<IconProps> = (props) => {
  return <Icon {...props} />;
};

export const FilePreview = ({ file, ...props }) => {
  const preview = useNinjaFilePreview(file);

  return <img {...props} src={preview} />;
};

export function UploadForm(props: Props) {
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);
  const upload = useCallback((files: FileList) => {
    const xhr = new XMLHttpRequest();
    xhr.timeout = 10000; // 10 seconds

    // Link abort button
    // abortButton.addEventListener(
    //   "click",
    //   () => {
    //     xhr.abort();
    //   },
    //   { once: true }
    // );

    // When the upload starts, we display the progress bar
    xhr.upload.addEventListener("loadstart", (event) => {
      toast("上传中");
    });

    // Each time a progress event is received, we update the bar
    xhr.upload.addEventListener("progress", (event) => {
      const value = (event.loaded / event.total) * 100;
      setProgress(value);
    });

    // When the upload is finished, we hide the progress bar.
    xhr.upload.addEventListener("loadend", (event) => {});

    // In case of an error, an abort, or a timeout, we hide the progress bar
    // Note that these events can be listened to on the xhr object too
    // function errorAction(event) {
    //   progressBar.classList.remove("visible");
    //   log.textContent = `Upload failed: ${event.type}`;
    // }
    // xhr.upload.addEventListener("error", errorAction);
    // xhr.upload.addEventListener("abort", errorAction);
    // xhr.upload.addEventListener("timeout", errorAction);

    // Build the payload
    const fileData = new FormData();
    for (const file of Array.from(files)) {
      fileData.append("files", file);
    }
    xhr.addEventListener("load", (ev) => {
      toast("上传完成");
      copyTextToClipboard(xhr.responseText);
    });

    // Theoretically, event listeners could be set after the open() call
    // but browsers are buggy here
    xhr.open("POST", "/api/files", true);

    // Note that the event listener must be set before sending (as it is a preflighted request)
    xhr.send(fileData);
  }, []);
  return (
    <form
      action="/api/files"
      encType="multipart/form-data"
      method="POST"
      className="rounded bg-white p-8 mx-auto space-y-4"
      {...props}
    >
      <div className="max-w-xl">
        <BaseInputFileHeadless
          id="files"
          multiple
          renderContent={({ open, remove, drop, files, el }) => (
            <Fragment>
              <div className="mb-4 flex items-center gap-2">
                <button
                  type="button"
                  className="nui-focus border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-800 dark:hover:border-primary-500 dark:hover:text-primary-600 relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border bg-white transition-colors duration-300"
                  // @ts-ignore
                  tooltip="Select files"
                  onClick={open}
                >
                  <Iconify icon="lucide:plus" className="h-4 w-4" />

                  <span className="sr-only">Select files</span>
                </button>

                <button
                  type="button"
                  className="nui-focus border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-800 dark:hover:border-primary-500 dark:hover:text-primary-600 relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border bg-white transition-colors duration-300"
                  data-nui-tooltip="开始上传"
                  onClick={() => {
                    if (files) {
                      upload(files);
                    }
                  }}
                >
                  <Iconify icon="lucide:arrow-up" className="h-4 w-4" />

                  <span className="sr-only">开始上传</span>
                </button>
              </div>
              <div
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => drop(e as unknown as DragEvent)}
              >
                {!files?.length ? (
                  <div
                    className="nui-focus border-muted-300 dark:border-muted-700 hover:border-muted-400 focus:border-muted-400 dark:hover:border-muted-600 dark:focus:border-muted-700 group cursor-pointer rounded-lg border-[3px] border-dashed p-8 transition-colors duration-300"
                    tabIndex={0}
                    role="button"
                    onClick={open}
                    onKeyDown={(e) => e.key === "Enter" && open()}
                  >
                    <div className="p-5 text-center">
                      <Iconify
                        icon="mdi-light:cloud-upload"
                        className="text-muted-400 group-hover:text-primary-500 group-focus:text-primary-500 mb-2 h-10 w-10 transition-colors duration-300 inline-block"
                      />

                      <h4 className="text-muted-400 font-sans text-sm">
                        拖拽文件到此以上传
                      </h4>

                      <div>
                        <span className="text-muted-400 font-sans text-[0.7rem] font-semibold uppercase">
                          Or
                        </span>
                      </div>

                      <label
                        htmlFor="file"
                        className="text-muted-400 group-hover:text-primary-500 group-focus:text-primary-500 cursor-pointer font-sans text-sm underline underline-offset-4 transition-colors duration-300"
                      >
                        选择文件
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <ul className="mt-6 space-y-2">
                      {Array.from(files).map((file) => (
                        <li key={file.name}>
                          <div className="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative flex items-center justify-between gap-2 rounded-xl border bg-white p-3">
                            <div className="flex items-center gap-2">
                              <div className="shrink-0">
                                {file.type.startsWith("image") ? (
                                  <FilePreview
                                    height={56}
                                    width={56}
                                    className="h-14 w-14 rounded-xl object-cover object-center"
                                    file={file}
                                    alt="Image preview"
                                  />
                                ) : (
                                  <Image
                                    height={56}
                                    width={56}
                                    className="h-14 w-14 rounded-xl object-cover object-center"
                                    src="https://tairo.cssninja.io/img/avatars/placeholder-file.png"
                                    alt="Image preview"
                                  />
                                )}
                              </div>

                              <div className="font-sans">
                                <span className="text-muted-800 dark:text-muted-100 line-clamp-1 block text-sm">
                                  {file.name}
                                </span>

                                <span className="text-muted-400 block text-xs">
                                  {file.size}
                                </span>
                              </div>
                            </div>

                            {/* <div className="ms-auto w-32 px-4 transition-opacity duration-300 opacity-100">
                            <BaseProgress value={0} size="xs" color="success" />
                          </div> */}

                            <div className="flex gap-2">
                              <button
                                className="border-muted-200 hover:border-primary-500 text-muted-700 dark:text-muted-200 hover:text-primary-600 dark:border-muted-700 dark:bg-muted-900 dark:hover:border-primary-500 dark:hover:text-primary-600 relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border bg-white transition-colors duration-300"
                                type="button"
                                // @ts-ignore
                                tooltip="Remove"
                                onClick={(e) => {
                                  e.preventDefault();
                                  remove(file);
                                }}
                              >
                                <Iconify icon="lucide:x" className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="ms-auto w-full px-4 transition-opacity duration-300 opacity-100">
                      <BaseProgress
                        value={progress}
                        size="xs"
                        color="success"
                      />
                    </div>
                  </div>
                )}
              </div>
            </Fragment>
          )}
        ></BaseInputFileHeadless>
      </div>
      {/* @ts-ignore */}
      {/* <BaseInput label="名称" name="filename" id="filename"></BaseInput> */}
    </form>
  );
}
