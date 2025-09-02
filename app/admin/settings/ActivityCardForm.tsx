"use client";
import { BaseInput, BaseButton } from "@glint-ui/react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { EntityContextProvider, useEntity, useEntityDispatch, ActivityCardEntity } from "./activityCardContext";
import EntityRouteSimple from "@/lib/client/createEntity/EntityRouteSimple";
import { ClientOnly } from "@/components/ClientOnly";
import { getActivityCardsFromSettingValue } from "@/lib/isomorphic/getActivityCards";
import { simpleHash } from "./simpleHash";
import toast from "react-hot-toast";


// 使用从 context 导入的类型
type ActivityCardConfig = ActivityCardEntity;

interface ActivityCardFormProps {
  settings: {
    key: string;
    value: any;
  }[];
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
        <BaseButton type="submit" color="primary">提交</BaseButton>
      </form>
    </div>
  );
}

const Form = () => {
  const state = useEntity();
  const dispatch = useEntityDispatch();
  const [formData, setFormData] = useState<Partial<ActivityCardConfig>>(() => ({
    postId: state.currentEntity.postId || 0,
    title: state.currentEntity.title || '',
    description: state.currentEntity.description || '',
    actionName: state.currentEntity.actionName || '开始探索',
    imgUrl: state.currentEntity.imgUrl || '',
    info: state.currentEntity.info || '',
    href: state.currentEntity.href || ''
  }));


  useEffect(() => {
    setFormData(
      state.currentEntity
    )
  }, [state.currentEntity]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 使用 useDebounce hook 处理防抖逻辑
  const debouncedPostId = useDebounce(formData.postId, 300);

  const loadPostData = useCallback(async () => {
    if (!formData.postId) return;

    try {
      const response = await fetch(`/api/getPost?id=${formData.postId}`);
      if (response.ok) {
        const post = await response.json();
        if (!post) return;

        // 更新表单状态
        setFormData((prev) => ({
          ...prev,
          title: post.title || '',
          description: post.excerpt || '',
          href: post.slug ? `/${post.slug}` : post.id ? `/posts/${post.id}` : '',
          imgUrl: post.cover_image?.src?.large ||
            post.cover_image?.dataURLs?.large ||
            `/_next/image?url=${encodeURIComponent(post.cover_image?.src?.large || '')}&w=1080&q=80`
        }));
      }
    } catch (error) {
      toast.error('加载文章数据失败:', error);
    }
  }, [formData.postId]);

  // useEffect(() => {
  //   if (debouncedPostId) {
  //     loadPostData(debouncedPostId);
  //   }
  // }, [debouncedPostId])

  const handleSubmit = () => {
    dispatch({
      type: "CREATE_OR_UPDATE_ENTITY",
      payload: {
        ...formData,
        postId: parseInt(formData.postId?.toString() || '0') || 0,
        id: state.currentEntity.id || simpleHash(`${formData.postId}-${formData.title}`),
      } as ActivityCardConfig,
    });
  };

  return (
    <>
      <div>
        <div className="grid grid-cols-2 gap-4">
          <BaseInput
            id="postId"
            label="文章 ID"
            type="number"
            value={formData.postId || ''}
            onChange={(e: string) => {
              handleInputChange('postId', e);
            }}
          />
          <div>
            <BaseButton size="sm" variant="pastel" onClick={loadPostData} >加载文章数据</BaseButton>
          </div>
        </div>
        <BaseInput
          id="title"
          label="标题"
          value={formData.title || ''}
          onChange={(e: string) => handleInputChange('title', e)}
        />
        <BaseInput
          id="description"
          label="描述"
          value={formData.description || ''}
          onChange={(e: string) => handleInputChange('description', e)}
        />
        <BaseInput
          id="actionName"
          label="按钮文字"
          value={formData.actionName || '开始探索'}
          onChange={(e: string) => handleInputChange('actionName', e)}
        />
        <BaseInput
          id="imgUrl"
          label="图片 URL (可选)"
          value={formData.imgUrl || ''}
          onChange={(e: string) => handleInputChange('imgUrl', e)}
        />
        <BaseInput
          id="href"
          label="链接地址 (可选)"
          value={formData.href || ''}
          onChange={(e: string) => handleInputChange('href', e)}
        />
        <BaseInput
          id="info"
          label="额外信息 (可选)"
          value={formData.info || ''}
          onChange={(e: string) => handleInputChange('info', e)}
        />
      </div>
      <BaseButton onClick={handleSubmit}>
        确定
      </BaseButton>
    </>
  );
};
