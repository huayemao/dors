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
      <BaseButtonIcon
        size="sm"
        color="primary"
        rounded="full"
        onClick={() => {
          setActive(true);
        }}
      >
        <FilterIcon className="size-4"></FilterIcon>
      </BaseButtonIcon>
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

  return (
    <ActionModal>
      <FilterModal dispatch={dispatch} state={state}></FilterModal>
    </ActionModal>
  );
};

export default memo(Search);
