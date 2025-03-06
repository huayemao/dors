import Link from "next/link";
import Icon from "./Base/Icon";

export const Application = ({ href, iconName, name }) => {
    return (
        <Link
            prefetch={
                ["/protected", "/notes", "/admin"].some((e) => href.startsWith(e))
                    ? false
                    : undefined
            }
            aria-current="page"
            href={href}
            className="router-link-active router-link-exact-active group flex flex-1 flex-col text-center"
        >
            <div className="nui-mask nui-mask-hexed bg-muted-200 dark:bg-muted-700 mx-auto flex size-16 scale-90 items-center justify-center transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-90 group-hover:bg-primary-400 dark:group-hover:bg-primary-400">
                <div className="nui-mask nui-mask-hexed dark:bg-muted-800 flex size-16 scale-95 items-center justify-center bg-white">
                    <Icon name={iconName} className="text-primary-400 size-6"></Icon>
                </div>
            </div>
            <h5 className="nui-heading nui-heading-md nui-weight-medium nui-lead-tight text-muted-400 dark:text-muted-400 group-hover:text-muted-600 dark:group-hover:text-muted-200">
                <span className="font-sans text-sm">{name}</span>
            </h5>
        </Link>
    );
};