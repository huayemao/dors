"use client";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEntity } from "../../../contexts/notes";
import { registerServiceWorker } from "@/lib/client/registerSW";
import { BaseCard, BaseHeading, BaseList } from "@shuriken-ui/react";
import PostListItem from "@/components/PostListItem";
import { title } from "process";
import { ArrowRight, GalleryVertical } from "lucide-react";
export default function NotesPage() {
  const { currentCollection, collectionList } = useEntity();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    // if (currentCollection && !params.id) {
    //   navigate("./" + currentCollection.id, { state: { __NA: {} } });
    // }

    registerServiceWorker({
      onNeedRefresh(updateSW) {
        const res = confirm("有新的版本");
        if (res) {
          updateSW();
        }
      },
    });
  }, [currentCollection, navigate, params.id]);

  return <div className="py-8 px-4  mx-auto max-w-5xl space-y-8">
    <BaseHeading as="h1" weight="extrabold" size="5xl" className=" text-muted-700 dark:text-white text-center">
      小记
    </BaseHeading>
    <BaseCard rounded="lg" className="p-4">
      <ul className="grid lg:grid-cols-2 gap-4">
        {collectionList.map((e, i) => (
          <li key={e.id} className="rounded-xl hover:bg-muted-100 focus-within:bg-muted-100 dark:hover:bg-muted-700/70 dark:focus-within:bg-muted-700/70 group flex items-center gap-3 p-2">
            <div className="nui-avatar nui-avatar-md nui-avatar-rounded-full bg-primary-100 dark:bg-primary-500/20 text-primary-500 ms-1 </li>shrink-0">
              <GalleryVertical className="size-5"></GalleryVertical>
            </div>
            <div>
              <h4 className="nui-heading nui-heading-md nui-weight-semibold text-muted-800 dark:text-white">
                <span>{e.name}</span>
              </h4>
              {/* <p className="nui-paragraph nui-paragraph-sm nui-weight-normal nui-lead-normal">
                <span className="text-muted-400">{e}</span>
              </p> */}
            </div>
            <div className="ms-auto flex -translate-x-1 items-center opacity-0 transition-all duration-300 group-focus-within:translate-x-0 group-focus-within:opacity-100 group-hover:translate-x-0 group-hover:opacity-100">
              <Link aria-current="page" to={"/" + e.id} className="nui-button-icon nui-button-rounded-lg nui-button-medium nui</div>-button-default scale-90">
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </BaseCard>
  </div>;
}
