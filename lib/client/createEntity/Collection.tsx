import { type Question } from "@/lib/types/Question";
import { readFromClipboard } from "@/lib/utils";
import { copyToClipboard } from "@/lib/client/utils/copyToClipboard";
import {
  BaseButtonIcon,
  BaseCard,
  BaseDropdown,
  BaseDropdownItem,
  BaseIconBox,
} from "@shuriken-ui/react";
import { CopyIcon, EditIcon, PlusIcon, UploadIcon } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { BaseEntity, EntityDispatch, EntityState } from "./createEntityContext";

export default function CollectionLayout({
  renderEntity,
  state,
  dispatch,
}: {
  state: EntityState;
  dispatch: EntityDispatch;
  renderEntity: (
    entity: BaseEntity,
    options: { preview: boolean }
  ) => ReactNode;
}) {
  const params = useParams();
  const {
    currentCollection,
    collectionList,
    currentEntity: currentQuestion,
    entityList: entityList,
    modalOpen,
    questionModalMode,
  } = state;

  const collection = collectionList.find(
    (e) => e.id == Number(params!.collectionId)
  );

  useEffect(() => {
    if (collection) {
      dispatch({
        type: "SET_CURRENT_COLLECTION",
        payload: collection!,
      });
    }
  }, [collection, dispatch]);

  const navigate = useNavigate();

  function open() {
    dispatch({ type: "SET_MODAL_OPEN", payload: true });
  }

  function close() {
    dispatch({ type: "SET_MODAL_OPEN", payload: false });
  }
  const importQuestionsFromClipBoard = () => {
    readFromClipboard().then((text) => {
      try {
        const obj = JSON.parse(text);
        if (obj[0].id) {
          dispatch({ type: "SET_ENTITY_LIST", payload: obj });
          alert("导入成功");
        }
      } catch (error) {
        alert("数据导入错误：" + error.message);
      }
    });
  };

  const copy = (e) => {
    e.preventDefault();
    copyToClipboard(`${JSON.stringify(entityList)}`);
    alert("已复制到剪贴板");
  };

  return (
    <>
      <div className="md:px-12">
        <div className="flex items-center gap-4 border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative w-full border border-b-0 rounded-b-none  bg-white transition-all duration-300 rounded-md p-6">
          <BaseDropdown
            classes={{ wrapper: "mr-auto" }}
            label={currentCollection?.name}
            headerLabel="合集"
          >
            {collectionList?.map((e) => (
              <Link to={"/" + e.id} key={e.id}>
                <BaseDropdownItem
                  end={
                    <Link to={"/" + e.id + "/edit"}>
                      <EditIcon className="h-4 w-4"></EditIcon>
                    </Link>
                  }
                  title={e.name}
                  text={"创建于 " + new Date(e.id).toLocaleDateString()}
                  rounded="sm"
                />
              </Link>
            ))}

            <BaseDropdownItem
              color="primary"
              classes={{ wrapper: "text-right" }}
              onClick={() => {
                navigate("/create");
              }}
            >
              <BaseIconBox color="primary">
                <PlusIcon></PlusIcon>
              </BaseIconBox>
            </BaseDropdownItem>
          </BaseDropdown>
          <BaseButtonIcon
            data-nui-tooltip="复制 JSON"
            data-nui-tooltip-position="down" onClick={copy}>
            <CopyIcon className="h-4 w-4"></CopyIcon>
          </BaseButtonIcon>
          <BaseButtonIcon
            data-nui-tooltip="导入"
            data-nui-tooltip-position="down"
            onClick={importQuestionsFromClipBoard}
          >
            <UploadIcon className="h-4 w-4"></UploadIcon>
          </BaseButtonIcon>
          <BaseButtonIcon
            data-nui-tooltip="新建题目"
            data-nui-tooltip-position="down"
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
            <div className="max-w-full  masonry sm:masonry-sm md:masonry-md">
              {entityList?.map((e, i, arr) => (
                <Link key={i} to={"./" + e.id}>
                  <BaseCard
                    rounded="md"
                    className=" break-inside-avoid my-3 p-4"
                  >
                    <div className="relative">
                      {renderEntity(e, { preview: true })}
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
