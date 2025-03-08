import { AnimatePresence, motion } from "framer-motion";
import {
  BaseCard,
} from "@shuriken-ui/react";

import {
  FC,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useNavigate,
  useOutlet,
  useParams,
} from "react-router-dom";
import { EntityDispatch, EntityState } from "./createEntityContext";
import { BaseCollection, BaseEntity } from "./types";
import { fetchWithAuth } from "../utils/fetch";
import { CollectionHeader } from "./CollectionHeader";
import { Table } from "@/app/(content)/data-process/Table";

export default function CollectionLayout<
  EType extends BaseEntity,
  CType extends BaseCollection & {
    _entityList?: EType[];
    entityList?: EType[];
    updated_at?: string;
  }
>({
  slots,
  renderEntity,
  state,
  dispatch,
  fetchCollection,
  layout = "masonry",
  getList = (e) => e
}: {
  slots?: Record<
    "search",
    FC<{
      state: EntityState<EType, CType>;
      dispatch: EntityDispatch<EType, CType>;
    }>
  >;
  state: EntityState<EType, CType>;
  dispatch: EntityDispatch<EType, CType>;
  renderEntity: (
    entity: EType,
    options: { preview: boolean }
  ) => ReactNode;
  fetchCollection?: (id: string) => Promise<CType | null>;
  layout?: "masonry" | "table";
  getList?: (list: EType[]) => object[]
}) {
  const { collectionId } = useParams();
  const outlet = useOutlet();
  useEffect(() => {
    if (!collectionId) {
      return;
    }

    let collection =
      state.collectionList.find((e) => e.id == collectionId) || null;
    if (collectionId != state.currentCollection?.id) {
      if (!collection && fetchCollection) {
        fetchCollection(collectionId)
          .then((res) => {
            collection = res;
          })
          .catch((error) => {
            console.error("从网络获取数据失败：" + error);
            collection = null;
          })
          .then(() => {
            dispatch({
              type: "SET_CURRENT_COLLECTION",
              payload: collection,
            });
          });
      }
      dispatch({
        type: "SET_CURRENT_COLLECTION",
        payload: collection,
      });
    }
  }, [
    collectionId,
    dispatch,
    state.collectionList,
    state.currentCollection?.id,
    fetchCollection,
  ]);

  const navigate = useNavigate();

  const Search = slots?.["search"];

  let list = useMemo(() => state.showingEntityList, [state.showingEntityList]);


  return (
    <>
      <div className="bg-muted-100 pt-6 relative">
        <CollectionHeader
          dispatch={dispatch}
          state={state}
          Search={Search}
        />
        <div className="col-span-12">
          <div className="relative bg-muted-100 w-full transition-all duration-300 rounded-md ptablet:p-8 p-6 lg:p-8 min-h-[60vh]">
            {layout === "masonry" ? (
              <div className="max-w-full masonry sm:masonry-sm md:masonry-md">
                {list.map((e, i, arr) => (
                  <div
                    key={e.id ?? JSON.stringify(e)}
                    className="cursor-pointer"
                    onClick={(event) => {
                      if ((event.target as HTMLElement).closest('a, button, [role="button"]')) {
                        return;
                      }
                      navigate('./' + e.id);
                    }}
                  >
                    {renderEntity(e, { preview: true })}
                  </div>
                ))}
              </div>
            ) : (
              <div className="max-w-full bg-white">
                {list.length !== 0 && (
                  <Table
                    data={getList(list)}
                    canEdit
                    onRowClick={(e) => {
                      navigate("./" + e.id);
                    }}
                    actions={[
                      {
                        title: "编辑",
                        onClick: (e) => {
                          navigate("./" + e.id);
                          dispatch({
                            type: "SET_ENTITY_MODAL_MODE",
                            payload: "edit",
                          });
                        },
                      },
                    ]}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>{outlet}</AnimatePresence>
    </>
  );
}


