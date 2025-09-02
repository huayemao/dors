import { FC, PropsWithChildren } from "react";
import EntityRouteUnified from "../EntityRouteUnified";
import { CompleteEntityComponentProps } from "../types/common";
import { BaseEntity, BaseCollection } from "../types";

// 定义笔记实体类型
interface NoteEntity extends BaseEntity {
  content: string;
  tags: string[];
  title: string;
}

// 定义笔记集合类型
interface NoteCollection extends BaseCollection {
  _entityList?: NoteEntity[];
  entityList?: NoteEntity[];
  type?: string;
}

// 创建表单组件
const CreateNoteForm: FC<PropsWithChildren> = ({ children }) => {
  return (
    <form>
      <div className="p-4">
        <input name="title" placeholder="标题" className="w-full p-2 border rounded" />
        <textarea name="content" placeholder="内容" className="w-full p-2 border rounded mt-2" />
        <input name="tags" placeholder="标签（逗号分隔）" className="w-full p-2 border rounded mt-2" />
        {children}
      </div>
    </form>
  );
};

// 更新表单组件
const UpdateNoteForm: FC<PropsWithChildren> = ({ children }) => {
  return (
    <form>
      <div className="p-4">
        <input name="title" placeholder="标题" className="w-full p-2 border rounded" />
        <textarea name="content" placeholder="内容" className="w-full p-2 border rounded mt-2" />
        <input name="tags" placeholder="标签（逗号分隔）" className="w-full p-2 border rounded mt-2" />
        {children}
      </div>
    </form>
  );
};

// 根页面组件
const NotesRootPage: FC<PropsWithChildren> = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">我的笔记</h1>
      <p>选择或创建一个笔记集合开始使用</p>
    </div>
  );
};

// 笔记预览页面组件
const NotePreviewPage: FC<{
  state: any;
  dispatch: any;
}> = ({ state, dispatch }) => {
  return (
    <div className="p-4">
      <h2>笔记预览</h2>
      <div className="prose">
        {state.currentEntity?.content}
      </div>
    </div>
  );
};

// 渲染笔记实体的函数
const renderNote = (note: NoteEntity, options: { preview: boolean; stackMode?: boolean }) => {
  return (
    <div className="border rounded p-4 shadow-sm">
      <h3 className="font-semibold">{note.title}</h3>
      <p className="text-gray-600 mt-2">
        {options.preview ? note.content.substring(0, 100) + "..." : note.content}
      </p>
      {note.tags && note.tags.length > 0 && (
        <div className="mt-2">
          {note.tags.map((tag, index) => (
            <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// 渲染笔记模态框标题的函数
const renderNoteModalTitle = (note: NoteEntity) => {
  return note.title || "新笔记";
};

// 渲染笔记模态框操作按钮的函数
const renderNoteModalActions = (note: NoteEntity) => {
  return (
    <div>
      <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
        分享
      </button>
    </div>
  );
};

// 将笔记列表转换为表格数据的函数
const getNoteList = (notes: NoteEntity[]) => {
  return notes.map(note => ({
    id: note.id,
    title: note.title,
    content: note.content.substring(0, 50) + "...",
    tags: note.tags?.join(", ") || "",
  }));
};

// 使用示例组件
export const NotesExample: FC<{
  state: any;
  dispatch: any;
}> = ({ state, dispatch }) => {
  // 配置对象
  const config: CompleteEntityComponentProps<NoteEntity, NoteCollection> = {
    // 基础 props
    state,
    dispatch,

    // 渲染配置
    renderEntity: renderNote,
    renderEntityModalTitle: renderNoteModalTitle,
    renderEntityModalActions: renderNoteModalActions,

    // 表单配置
    createForm: CreateNoteForm,
    updateForm: UpdateNoteForm,

    // 布局配置
    layout: "masonry",
    getList: getNoteList,

    // 路由配置
    basename: "/notes",
    RootPage: NotesRootPage,
    EntityPreviewPage: NotePreviewPage,

    // 云同步配置
    fetchCollection: async (id: string) => {
      const response = await fetch(`/api/notes/${id}`);
      return response.json();
    },
    syncToCloud: async (collection: any, entityList: any) => {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection, entityList }),
      });
      return response.json();
    },
  };

  return <EntityRouteUnified {...config} />;
};

export default NotesExample;
