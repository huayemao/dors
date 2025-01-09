import { BaseButtonIcon, BaseIconBox, BaseInput } from "@shuriken-ui/react";
import { useEntity, useEntityDispatch } from "@/contexts/notes";
import { FC, memo, useCallback, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { FilterIcon } from "lucide-react";
import { Modal } from "../Base/Modal";
import FilterModal from "./FilterModal";

const ActionModal = ({ children }) => {
  const [active, setActive] = useState(false);
  return (
    <>
      <button className="absolute right-0  end-0 top-0 z-[1] flex h-10 w-10 items-center justify-center text-muted-400 transition-colors duration-300 hover:text-primary-500">
        <FilterIcon
          className="size-4"
          onClick={() => {
            setActive(true);
          }}
        ></FilterIcon>
      </button>
      <AnimatePresence>
        <Modal
          key={String(active)}
          title="筛选"
          open={active}
          onClose={() => {
            setActive(false);
          }}
        >
          {children}
        </Modal>
      </AnimatePresence>
    </>
  );
};

const Search: FC<{
  state: ReturnType<typeof useEntity>;
  dispatch: ReturnType<typeof useEntityDispatch>;
}> = ({ state, dispatch }) => {
  const { allTags } = useMemo(() => {
    const allTags = Array.from(
      new Set(
        state.entityList.flatMap((e) => e.tags).filter((e) => !!e?.trim())
      )
    );
    return {
      allTags,
    };
  }, [state.entityList]);

  const search = useCallback(
    (v) => {
      if (v != state.filters.content)
        dispatch({
          type: "SET_FILTERS",
          payload: {
            filters: {
              ...state.filters,
              all: v,
            },
          },
        });
    },
    [dispatch, state.filters]
  );

  return (
    <div className="flex-1 mx-2">
      <BaseInput
        classes={{ wrapper: "flex-1" }}
        icon="lucide:search"
        onChange={search}
        defaultValue={(state.filters.content as string) || ""}
        action={
          <ActionModal>
            <FilterModal dispatch={dispatch} state={state}></FilterModal>
          </ActionModal>
        }
      ></BaseInput>
    </div>
  );
};

export default memo(Search);
