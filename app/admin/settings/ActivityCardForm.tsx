"use client";
import { BaseInput, BaseButton } from "@glint-ui/react";
import { useEffect, useMemo, useRef } from "react";
import { EntityContextProvider, useEntity, useEntityDispatch, ActivityCardEntity } from "./activityCardContext";
import EntityRouteSimple from "@/lib/client/createEntity/EntityRouteSimple";
import { ClientOnly } from "@/components/ClientOnly";
import { getActivityCardsFromSettingValue } from "@/lib/isomorphic/getActivityCards";


// 使用从 context 导入的类型
type ActivityCardConfig = ActivityCardEntity;

interface ActivityCardFormProps {
  settings: {
    key: string;
    value: any;
  }[];
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // 转换为32位整数
  }
  return hash;
}

export function ActivityCardForm({ settings }: ActivityCardFormProps) {
  return (
    <ClientOnly>
      <EntityContextProvider>
        <Content settings={settings}></Content>
      </EntityContextProvider>
    </ClientOnly>
  );
}

function Content({ settings }: ActivityCardFormProps) {
  let activityCardList = useMemo(() => {
    const sValue = settings.find(
      (e) => e.key === "activity_cards"
    )?.value as string;
    return getActivityCardsFromSettingValue(sValue);
  }, [settings]);


  const state = useEntity();
  const dispatch = useEntityDispatch();

  useEffect(() => {
    dispatch({
      type: "SET_ENTITY_LIST",
      payload: activityCardList.map((e: ActivityCardConfig) => ({
        ...e,
        id: e.id || simpleHash(`${e.postId}-${e.title}`)
      })),
    });
  }, [dispatch, activityCardList]);

  return (
    <div>
      <EntityRouteSimple
        key="activity-cards"
        renderEntityModalTitle={(e: ActivityCardConfig) => e.title || 'ActivityCard'}
        renderEntity={(e: ActivityCardConfig) => (
          <div className="border border-muted-200 dark:border-muted-700 rounded-lg p-4">
            <div className="flex items-center gap-4">
              {e.imgUrl && (
                <img
                  src={e.imgUrl}
                  alt={e.title}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h4 className="font-medium">{e.title}</h4>
                <p className="text-sm text-muted-500">{e.description}</p>
                <p className="text-xs text-muted-400">文章 ID: {e.postId}</p>
              </div>
            </div>
          </div>
        )}
        state={state}
        dispatch={dispatch}
        layout="table"
        basename={"/admin/settings"}
        createForm={Form}
        updateForm={Form}
      ></EntityRouteSimple>
      <form action="/api/settings" method="POST">
        <input
          className="hidden"
          type="text"
          name="key"
          value={"activity_cards"}
        />
        {state.entityList.map((v) => (
          <textarea
            className="hidden"
            key={v.id}
            name="value"
            value={JSON.stringify(v)}
          ></textarea>
        ))}
        <BaseButton type="submit">提交</BaseButton>
      </form>
    </div>
  );
}

const Form = () => {
  const state = useEntity();
  const dispatch = useEntityDispatch();
  const ref = useRef<HTMLDivElement>(null);

  const loadPostData = async (postId: number) => {
    if (!postId) return;

    try {
      const response = await fetch(`/api/getPost?id=${postId}`);
      if (response.ok) {
        const post = await response.json();

        // 更新表单中的字段
        const titleInput = ref.current?.querySelector('#title') as HTMLInputElement;
        const descriptionInput = ref.current?.querySelector('#description') as HTMLInputElement;
        const imgUrlInput = ref.current?.querySelector('#imgUrl') as HTMLInputElement;

        if (titleInput && !titleInput.value) titleInput.value = post.title || '';
        if (descriptionInput && !descriptionInput.value) descriptionInput.value = post.excerpt || '';
        if (imgUrlInput && !imgUrlInput.value) {
          imgUrlInput.value = post.cover_image?.src?.large ||
            post.cover_image?.dataURLs?.large ||
            `/_next/image?url=${encodeURIComponent(post.cover_image?.src?.large || '')}&w=1080&q=80`;
        }
      }
    } catch (error) {
      console.error('加载文章数据失败:', error);
    }
  };

  return (
    <>
      <div ref={ref}>
        <BaseInput
          id="postId"
          label="文章 ID"
          type="number"
          defaultValue={state.currentEntity.postId || ''}
          onChange={(e: string) => {
            const postId = parseInt(e) || 0;
            if (postId) {
              loadPostData(postId);
            }
          }}
        />
        <BaseInput
          id="title"
          label="标题"
          defaultValue={state.currentEntity.title || ''}
        />
        <BaseInput
          id="description"
          label="描述"
          defaultValue={state.currentEntity.description || ''}
        />
        <BaseInput
          id="actionName"
          label="按钮文字"
          defaultValue={state.currentEntity.actionName || '开始探索'}
        />
        <BaseInput
          id="imgUrl"
          label="图片 URL (可选)"
          defaultValue={state.currentEntity.imgUrl || ''}
        />
        <BaseInput
          id="info"
          label="额外信息 (可选)"
          defaultValue={state.currentEntity.info || ''}
        />
      </div>
      <BaseButton
        onClick={() => {
          const el = ref.current!;
          const inputs = Array.from(el.querySelectorAll("input"));
          const json = Object.fromEntries(
            inputs.map((el) => [el.id, el.value])
          );
          dispatch({
            type: "CREATE_OR_UPDATE_ENTITY",
            payload: {
              ...json,
              postId: parseInt(json.postId) || 0,
              id: state.currentEntity.id || simpleHash(`${json.postId}-${json.title}`),
            } as ActivityCardConfig,
          });
        }}
      >
        确定
      </BaseButton>
    </>
  );
};
