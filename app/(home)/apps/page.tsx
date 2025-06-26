import { getResourceItems } from "@/lib/server/resource";
import { Application } from "@/components/Application";
import { ClearCacheButton } from "@/components/ClearCacheButton";
import { Metadata } from "next";


export const revalidate = 1200;

export const metadata: Metadata = {
    title: '工作台',
    description: '花野猫先生辛勤劳作之地',
};


//https://beta.nextjs.org/docs/data-fetching/fetching#segment-cache-configuration

export default async function Apps({
}: {
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
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 pb-8">
                {apps.map((app, i) => (
                    <Application key={i} {...app}></Application>
                ))}
            </div>
        </div>
    );
}


