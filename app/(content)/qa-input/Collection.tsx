"use client";

import QA from "@/components/Question";
import { Question } from "@/lib/types/Question";
import { readFromClipboard, withConfirm } from "@/lib/utils";
import { copyToClipboard } from "@/lib/utils/copyToClipboard";
import {
  BaseButtonIcon,
  BaseCard,
  BaseDropdown,
  BaseDropdownItem,
  BaseIconBox,
} from "@shuriken-ui/react";
import localforage from "localforage";
import { CopyIcon, ImportIcon, PlusIcon } from "lucide-react";
import {
  Link,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useQAs, useQAsDispatch } from "./contexts";

export async function collectionLoader({ params }) {
  const collectionList = await localforage.getItem("collectionList");
  //@ts-ignore
  const collection = collectionList.find((e) => e.id == params.collectionId);
  return { collection };
}

export default function CollectionLayout({}: {}) {
  const {
    currentCollection,
    collectionList,
    currentQuestion,
    questionList,
    modalOpen,
    questionModalMode,
  } = useQAs();
  const dispatch = useQAsDispatch();
  const navigate = useNavigate();
  const l = useLocation();

  // @ts-ignore
  const { collection } = useLoaderData();
  function open() {
    dispatch({ type: "SET_MODAL_OPEN", payload: true });
  }

  function close() {
    dispatch({ type: "SET_MODAL_OPEN", payload: false });
  }

  const handleRemove = () => {
    withConfirm(() => {
      dispatch({
        type: "REMOVE_QUESTION",
        payload: currentQuestion.id,
      });
      dispatch({ type: "CANCEL" });
    });
  };

  // todo: questions 放到最后一级去 render。外层只提供一个 context

  function setCurrentQuestion(q: Question) {
    dispatch({
      type: "SET_CURRENT_QUESTION",
      payload: q,
    });
  }

  const importQuestionsFromClipBoard = () => {
    readFromClipboard().then((text) => {
      try {
        const obj = JSON.parse(text);
        if (obj[0].id) {
          dispatch({ type: "SET_QUESTION_LIST", payload: obj });
          alert("导入成功");
        }
      } catch (error) {
        alert("数据导入错误：" + error.message);
      }
    });
  };

  const copy = (e) => {
    e.preventDefault();
    copyToClipboard(`<QuestionList  data={${JSON.stringify(questionList)}}/>`);
    alert("已复制到剪贴板");
  };

  function toAddQA() {
    dispatch({
      type: "CANCEL",
    });
    dispatch({
      type: "SET_QUESTION_MODAL_MODE",
      payload: "edit",
    });
    open();
  }
  return (
    <>
      <div className="md:px-12">
        <div className="flex gap-4 border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative w-full border border-b-0 rounded-b-none  bg-white transition-all duration-300 rounded-md p-6">
          <BaseDropdown
            classes={{ wrapper: "mr-auto" }}
            label={currentCollection.name}
          >
            {collectionList?.map((e) => (
              <Link to={"./" + e.id} key={e.id}>
                <BaseDropdownItem
                  title={e.name}
                  text={e.id + ""}
                  rounded="sm"
                />
              </Link>
            ))}

            <BaseDropdownItem
              classes={{ wrapper: "text-right" }}
              className="text-right"
            >
              <BaseIconBox color="primary">
                <PlusIcon></PlusIcon>
              </BaseIconBox>
            </BaseDropdownItem>
          </BaseDropdown>
          <BaseButtonIcon onClick={copy}>
            <CopyIcon className="h-4 w-4"></CopyIcon>
          </BaseButtonIcon>
          <BaseButtonIcon onClick={importQuestionsFromClipBoard}>
            <ImportIcon className="h-4 w-4"></ImportIcon>
          </BaseButtonIcon>
          <BaseButtonIcon
            onClick={() => {
              navigate("./create");
              // open();
              // toAddQA();
            }}
          >
            <PlusIcon className="h-4 w-4"></PlusIcon>
          </BaseButtonIcon>
        </div>
        <div className="col-span-12">
          <div className="bg-slate-50 relative w-full border transition-all duration-300 rounded-md ptablet:p-8 p-6 lg:p-8">
            <div className="max-w-full  masonry sn:masonry-sm md:masonry-md">
              {questionList?.map((e, i, arr) => (
                <Link key={i} to={"./" + e.id}>
                  <BaseCard
                    rounded="md"
                    className=" break-inside-avoid my-3 p-4"
                  >
                    <div className="relative">
                      <QA preview data={e} />
                    </div>
                  </BaseCard>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </>
  );
}
