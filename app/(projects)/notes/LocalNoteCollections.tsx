"use client";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEntity } from "../../../contexts/notes";
import { BaseCard, BaseHeading, BaseTabs } from "@shuriken-ui/react";
import PostListItem from "@/components/PostListItem";
import { ArrowRight, GalleryVertical } from "lucide-react";
export default function LocalNoteCollections() {
  const { collectionList } = useEntity();

  return (
    <BaseCard rounded="lg" className="p-4">
      <ul className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {collectionList?.map((e, i) => (
          <li key={e.id}>
            <Link
              to={"/" + e.id}
              className="rounded-xl hover:bg-muted-100 focus-within:bg-muted-100 dark:hover:bg-muted-700/70 dark:focus-within:bg-muted-700/70 group flex items-center gap-3 p-2"
            >
              <div>
                <h4 className="nui-heading nui-heading-md nui-weight-semibold text-muted-800 dark:text-white">
                  <span>{e.name}</span>
                </h4>
                {/* <p className="nui-paragraph nui-paragraph-sm nui-weight-normal nui-lead-normal">
        <span className="text-muted-400">{e}</span>
      </p> */}
              </div>
              <div className="ms-auto flex -translate-x-1 items-center opacity-0 transition-all duration-300 group-focus-within:translate-x-0 group-focus-within:opacity-100 group-hover:translate-x-0 group-hover:opacity-100">
                <span className="nui-button-icon nui-button-rounded-lg nui-button-medium nui</div>-button-default scale-90">
                  <ArrowRight className="size-4" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </BaseCard>
  );
}
