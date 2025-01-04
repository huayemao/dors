import { BaseInput } from "@shuriken-ui/react";
import { useEntity, useEntityDispatch } from "@/contexts/notes";
import { FC, memo, useCallback, useMemo } from "react";

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
      if (!!v)
        dispatch({
          type: "SET_FILTERS",
          payload: {
            filters: {
              ...state.filters,
              content: v,
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
      ></BaseInput>
    </div>
  );
};

export default memo(Search);
