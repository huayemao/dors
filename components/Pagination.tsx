import clsx from "clsx";
import Link from "next/link";
import { UrlObject } from "url";

type Url = string | UrlObject;

type Props = {
  pageCount: number;
  buildHref: (p: number) => Url;
  pageNum: number;
};

const WINDOW_LENGTH = 10;

export function Pagination({ pageNum, pageCount, buildHref }: Props) {
  const begin = pageNum - WINDOW_LENGTH > 0 ? pageNum - WINDOW_LENGTH : 0;

  const items = Array.from({ length: pageCount }, (e, i) => i + 1);
  const lastItem = items.slice(-1)[0];

  return (
    <ul className="bg-muted-100 rounded-full px-1 dark:border-muted-600 dark:bg-muted-700 mb-4 inline-flex flex-wrap gap-2  p-1 md:mb-0 md:gap-1">
      {(begin + WINDOW_LENGTH < items.length
        ? items.slice(begin, begin + WINDOW_LENGTH)
        : items.slice(begin, -1)
      ).map((e, i) => (
        <li key={e}>
          <Link
            href={buildHref(e)}
            shallow
            className={clsx(
              "border flex h-10 w-10 items-center justify-center font-sans text-sm transition-all duration-300 dark:bg-muted-800 border-muted-200 dark:border-muted-700 hover:bg-muted-100 dark:hover:bg-muted-900  hover:text-muted-700 dark:hover:text-muted-400  rounded-full",
              {
                "bg-white text-muted-500": !(pageNum ? pageNum === e : e === 1),
                "bg-primary-500 border-primary-500 shadow-primary-500/50 dark:shadow-primary-500/20 text-white shadow-sm":
                  pageNum ? pageNum === e : e === 1,
              }
            )}
          >
            {e}
          </Link>
        </li>
      ))}
      <li>
        <form action="/" method="GET">
          <input
            name={"page"}
            type="number"
            defaultValue={pageNum || 1}
            className=" mx-2 nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 peer border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 rounded-lg"
          />
        </form>
      </li>
      <li key={lastItem}>
        <Link
          href={buildHref(lastItem)}
          shallow
          className={clsx(
            "border flex h-10 w-10 items-center justify-center font-sans text-sm transition-all duration-300 dark:bg-muted-800 border-muted-200 dark:border-muted-700 hover:bg-muted-100 dark:hover:bg-muted-900  hover:text-muted-700 dark:hover:text-muted-400  rounded-full",
            {
              "bg-white text-muted-500": !(pageNum
                ? pageNum === lastItem
                : lastItem === 1),
              "bg-primary-500 border-primary-500 shadow-primary-500/50 dark:shadow-primary-500/20 text-white shadow-sm":
                pageNum ? pageNum === lastItem : lastItem === 1,
            }
          )}
        >
          {lastItem}
        </Link>
      </li>
    </ul>
  );
}
