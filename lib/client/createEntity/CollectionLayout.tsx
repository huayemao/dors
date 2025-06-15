import { AnimatePresence, motion } from "framer-motion";
import { BaseCard } from "@shuriken-ui/react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, EffectCoverflow, EffectCreative } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-creative';

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
  useSearchParams,
} from "react-router-dom";
import { EntityDispatch, EntityState } from "./createEntityContext";
import { BaseCollection, BaseEntity } from "./types";
import { fetchWithAuth } from "../utils/fetch";
import { CollectionHeader } from "./CollectionHeader";
import { Table } from "@/app/(content)/data-process/Table";
import { StackCards } from "./components/StackCards";

export default function CollectionLayout<
  EType extends BaseEntity,
  CType extends BaseCollection & {
    _entityList?: EType[];
    entityList?: EType[];
    updated_at?: string;
    layout?: "masonry" | "stack" | "table";
  }
>({
  slots,
  renderEntity,
  state,
  dispatch,
  fetchCollection,
  layout = "masonry",
  getList = (e) => e,
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
  renderEntity: (entity: EType, options: { preview: boolean }) => ReactNode;
  fetchCollection?: (id: string) => Promise<CType | null>;
  layout?: "masonry" | "stack" | "table";
  getList?: (list: EType[]) => object[];
}) {
  const { collectionId } = useParams();
  const outlet = useOutlet();
  const swiperRef = useRef<any>(null);

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
      <div className="pt-3 relative">
        <CollectionHeader dispatch={dispatch} state={state} Search={Search} />
        <div className="lg:max-w-7xl mx-auto">
          <div className="relative w-full transition-all duration-300 rounded-md ptablet:p-8 p-6 lg:p-8 min-h-[60vh]">
            {(state.currentCollection?.layout || layout) === "masonry" ? (
              <div className="max-w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                {list.map((e, i, arr) => (
                  <div
                    key={e.id ?? JSON.stringify(e)}
                    className="cursor-pointer"
                    onClick={(event) => {
                      if (
                        (event.target as HTMLElement).closest(
                          'a, button, [role="button"]'
                        )
                      ) {
                        return;
                      }
                      navigate("./" + e.id);
                    }}
                  >
                    {renderEntity(e, { preview: true })}
                  </div>
                ))}
              </div>
            ) : (state.currentCollection?.layout || layout) === "stack" ? (
              <StackCards
                items={list}
                currentIndex={state.currentIndex}
                onIndexChange={(index) => {
                  dispatch({
                    type: "SET_CURRENT_INDEX",
                    payload: index
                  });
                }}
                renderItem={(entity) => renderEntity(entity, { preview: false })}
                getItemId={(entity) => entity.id ?? JSON.stringify(entity)}
              />
            ) : (
              <div className="max-w-full bg-white border shadow">
                {list.length !== 0 && (
                  <Table
                    data={getList(list)}
                    canEdit
                    actions={[
                      {
                        title: "查看",
                        onClick: (e) => {
                          navigate("./" + e.id);
                        },
                      },
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
                      {
                        title: "删除",
                        onClick: (e) => {
                          dispatch({
                            type: "REMOVE_ENTITY",
                            payload: e.id,
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
      <AnimatePresence mode="wait" initial={false}>
        {outlet}
      </AnimatePresence>
    </>
  );
}
