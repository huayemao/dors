import { Metadata } from "next";

export const metadata: Metadata = {
    title: '文章格式处理工具',
    description: '云南省中药材大数据中心文章格式处理工具',
    icons:['/img/sprout.svg']
}

export default async function Layout({
    children,
    params,
}: {
    children: JSX.Element;
    params: any;
}) {

    return (
        <>
            {children}
        </>
    );
}
