import { PaginateOptions } from "@/lib/paginator";
import { getPageCount, getPosts, getProcessedPosts } from "@/lib/posts";
import { getResourceItems } from "@/lib/server/resource";
import { Application } from "@/components/Application";
import { ClearCacheButton } from "@/components/ClearCacheButton";
import { Metadata } from "next";

type SearchParams = PaginateOptions;
type Posts = Awaited<ReturnType<typeof getProcessedPosts>>;

export const revalidate = 1200;

export const metadata: Metadata = {
    title: '工作台',
    description: '花野猫先生辛勤劳作之地',
    manifest: "/apps/manifest.webmanifest",
};


//https://beta.nextjs.org/docs/data-fetching/fetching#segment-cache-configuration

export default async function Apps({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const resourceItems = await getResourceItems();

    const apps = [
        {
            name: "小记",
            href: "/notes",
            iconName: "notebook",
        },
        {
            name: "自留地",
            href: "/protected",
            iconName: "globe-lock",
        },
        {
            name: "后台",
            href: "/admin",
            iconName: "cog",
        },
    ].concat(
        resourceItems.map((e) => ({
            name: e.title,
            href: e.url,
            iconName: e.iconName || "link",
        }))
    );

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-end">
                <ClearCacheButton path="/apps" />
            </div>
            <div className="flex justify-around gap-6  pb-8 flex-wrap">
                {apps.map((app, i) => (
                    <Application key={i} {...app}></Application>
                ))}
            </div>
        </div>
    );
}


