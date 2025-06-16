"use client";
import EntityRoute from "@/lib/client/createEntity/EntityRoute";
import { Note } from "@/app/(projects)/notes/constants";
import { useEntity, useEntityDispatch } from "@/contexts/notes";
import { NoteForm } from "@/app/(projects)/notes/NoteForm";
import NotesPage from "@/app/(projects)/notes/page";
import {
  ComponentProps,
  FC,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import localforage from "localforage";
import toast from "react-hot-toast";
import { NoteItem } from "./NoteItem";
import { NoteModalTitle } from "./NoteModalTitle";
import { BaseDropdownItem } from "@shuriken-ui/react";
import { Archive, Copy, Edit2, LinkIcon } from "lucide-react";
import { copyToClipboard } from "@/lib/client/utils/copyToClipboard";
import { cn, copyTextToClipboard } from "@/lib/utils";
import { useFilter } from "./useFilter";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BASE_NAME, HIDDEN_TAGS } from "./constants";
import Search from "./Search";
import { useCloseModal } from "@/lib/client/hooks/useCloseModal";

export const useActions = (note: Note) => {
  const close = useCloseModal()
  const state = useEntity();
  const dispatch = useEntityDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const res = useMemo(() => {
    const targetItemIndex = state.entityList?.findIndex(
      (e) => e.id === note.id
    );
    const newList = [...state.entityList];
    return {
      edit: {
        title: "编辑",
        onClick: () => {
          if (!location.pathname.includes(String(note.id))) {
            navigate(`/${state.currentCollection?.id}/` + note.id, {
              state: { __NA: {} },
            });
          }
          setTimeout(() => {
            dispatch({
              type: "SET_ENTITY_MODAL_MODE",
              payload: "edit",
            });
          });
        },
        start: <Edit2 className="h-4 w-4" />,
        stopPropagation: true,
      },
      copyLink: {
        title: "复制链接",
        onClick: () => {
          copyTextToClipboard(
            `/notes/${state.currentCollection?.id}/` + note.id
          ).then(() => {
            toast.success("已复制链接到剪贴板");
          });
        },
        start: <LinkIcon className="h-4 w-4" />,
        stopPropagation: true,
      },
      copy: {
        title: "复制内容",
        onClick: () => {
          copyTextToClipboard(note.content).then(() => {
            toast.success("复制成功");
          });
        },
        start: <Copy className="h-4 w-4" />,
        stopPropagation: true,
      },
      archive: {
        title: "归档",
        onClick: () => {
          newList[targetItemIndex] = {
            ...note,
            tags: note.tags.concat(HIDDEN_TAGS[0]),
          };
          // todo: 改成 editQuestion
          dispatch({ type: "SET_ENTITY_LIST", payload: newList });
          toast.success("归档成功");
          if (!!params.entityId && state.currentEntity?.id === note.id) {
            close();
          }
        },
        start: <Archive className="h-4 w-4" />,
        stopPropagation: true,
      },
    };
  }, [dispatch, navigate, params.entityId, note, state.entityList]);

  return res;
};

export const NotesContainer = ({
  basename = BASE_NAME,
}: {
  basename?: string;
}) => {
  const state = useEntity();
  const dispatch = useEntityDispatch();

  const { filterTags } = useFilter();

  useEffect(() => {
    // 列表变化时重新应用筛选器
    filterTags(undefined, true, false);
  }, [state.entityList]);

  useEffect(() => {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then((persistent) => {
        localforage.getItem("alerted").then((v) => {
          if (v) {
            return;
          }
          if (persistent) {
          } else {
            toast("注意：本地存储可能被 UA 清除");
          }
          localforage.setItem("alerted", true);
        });
      });
    }
  }, []);

  return (
    <EntityRoute
      key="notes"
      renderEntityModalTitle={(e: Note) => (
        <NoteModalTitle note={e} filterTags={filterTags} />
      )}
      renderEntityModalActions={(e: Note) => <Actions e={e}></Actions>}
      renderEntity={(e: Note, { preview, stackMode }) => (
        <NotewithActions
          key={e.id}
          data={e}
          preview={preview}
          className={cn({ 'xs:max-h-[38vh] lg:h-[45vh] xs:h-[38vh]': stackMode })}
          filterTags={filterTags}
        ></NotewithActions>
      )}
      slots={{ search: Search }}
      state={state}
      dispatch={dispatch}
      RootPage={NotesPage}
      basename={basename}
      createForm={NoteForm}
      updateForm={NoteForm}
    ></EntityRoute>
  );
};

function NotewithActions({
  data,
  ...props
}: Omit<ComponentProps<typeof NoteItem>, "actions">) {
  const actions = useActions(data);
  return <NoteItem data={data} {...props} actions={actions}></NoteItem>;
}

function Actions({ e }: { e: Note }) {
  const actions = useActions(e);
  return (
    <>
      {Object.values(actions).map((action) => {
        return (
          <BaseDropdownItem
            key={action.title}
            rounded="md"
            data-nui-tooltip={action.title}
            {...action}
          ></BaseDropdownItem>
        );
      })}
    </>
  );
}

export function getExcludeIds(
  hasHiddenTags: boolean | undefined,
  entityList: {
    seq: string;
    id: number;
    content: string;
    tags: string[];
  }[]
) {
  return hasHiddenTags || typeof hasHiddenTags == "undefined"
    ? undefined
    : entityList
      .filter((e) => e.tags.some((t) => HIDDEN_TAGS.includes(t)))
      .map((e) => e.id);
}
