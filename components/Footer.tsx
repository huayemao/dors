import { SITE_META } from "@/constants";
import { getFooterConfig, FooterConfig } from "@/lib/server/services/settings";

export async function Footer({
  config: initialConfig,
}: {
  config?: FooterConfig;
} = {}) {
  const config = initialConfig || (await getFooterConfig());
  const { brandDescription, columns } = config;

  return (
    <footer className="group relative bg-muted-50 dark:bg-muted-800 text-muted-600 body-font overflow-hidden">
      <div className="relative w-full max-w-7xl px-5 py-24 mx-auto ">
        <div className="flex flex-col ptablet:flex-row ltablet:flex-row lg:flex-row gap-6 ptablet:gap-0 ltablet:gap-0 lg:gap-0 flex-wrap md:text-left text-center -mb-10 -mx-4">
          <div className="w-full ptablet:w-1/2 ltablet:w-1/4 lg:w-1/4 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left px-4">
            <a className="flex flex-col md:flex-row gap-3 title-font font-medium items-center md:justify-start justify-center text-muted-800 dark:text-white">
              <img
                className="h-12"
                src="/favicon.svg"
                alt="dors logo"
                width="48"
                height="48"
              />
              <span className="font-heading font-bold text-2xl">Dors</span>
            </a>
            {brandDescription && (
              <p className="font-sans text-sm w-full max-w-xs mx-auto md:max-w-[220px] md:mx-0 mt-2 text-muted-500 dark:text-muted-400">
                {brandDescription}
              </p>
            )}
          </div>

          {columns.map((col, idx) => (
            <div
              key={col.id || col.title || idx}
              className="w-full ptablet:w-1/2 ltablet:w-1/4 lg:w-1/4 px-4"
            >
              <h2 className="font-heading font-semibold text-muted-800 dark:text-white tracking-widest text-sm mb-3">
                {col.title}
              </h2>
              <ul className="font-sans list-none space-y-2 mb-10">
                {col.links?.map((link, lIdx) => {
                  const isExternal =
                    link.href?.startsWith("http://") ||
                    link.href?.startsWith("https://");
                  return (
                    <li key={link.id || link.href || lIdx}>
                      <a
                        href={link.href}
                        className="text-muted-600 dark:text-muted-400 hover:text-primary-500 dark:hover:text-primary-500"
                        {...(isExternal
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {link.title}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="relative border-t bg-muted-100 dark:bg-muted-900">
        <div className="w-full max-w-7xl mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
          <p className="text-muted-500 text-sm text-center sm:text-left flex flex-col md:flex-row gap-2">
            © 2022 - present. All Rights Reserved.
            {SITE_META.ICP && (
              <span className="hover:text-primary-500">
                <a
                  href="http://beian.miit.gov.cn/"
                  className="font-sans ml-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {SITE_META.ICP}
                </a>
              </span>
            )}
          </p>
          <span className="sm:ml-auto sm:mt-0 mt-2 sm:w-auto w-full sm:text-left text-center text-muted-500 text-sm">
            <a
              href="/"
              className="font-sans font-semibold text-primary-500 ml-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              花野猫
            </a>
            打造
          </span>
        </div>
      </div>
    </footer>
  );
}

