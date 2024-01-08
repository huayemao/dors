type Props = {
  data: {
    title: string;
    description: string;
    href: string;
  }[];
};

function ToolBox({ data }: Props) {
  return (
    <div className="not-prose mx-auto mt-6 grid w-full max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
      {data.map((item) => (
        <div
          key={item.title}
          className="nui-card nui-card-curved nui-card-white nui-card-shadow-hover hover:!border-primary-500 group border-2"
        >
          <a
            aria-current="page"
            href={item.href}
            className="router-link-active router-link-exact-active block p-6"
          >
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                aria-hidden="true"
                role="img"
                className="mx-auto icon group-hover:text-primary-500 text-muted-400 h-8 w-8 transition-all duration-300 group-hover:rotate-6"
                width="1em"
                height="1em"
                viewBox="0 0 256 256"
              >
                <g fill="currentColor">
                  <path
                    d="M224 118.31V200a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8v-81.69A191.14 191.14 0 0 0 128 144a191.08 191.08 0 0 0 96-25.69Z"
                    opacity=".2"
                  ></path>
                  <path d="M104 112a8 8 0 0 1 8-8h32a8 8 0 0 1 0 16h-32a8 8 0 0 1-8-8Zm128-40v128a16 16 0 0 1-16 16H40a16 16 0 0 1-16-16V72a16 16 0 0 1 16-16h40v-8a24 24 0 0 1 24-24h48a24 24 0 0 1 24 24v8h40a16 16 0 0 1 16 16ZM96 56h64v-8a8 8 0 0 0-8-8h-48a8 8 0 0 0-8 8ZM40 72v41.62A184.07 184.07 0 0 0 128 136a184 184 0 0 0 88-22.39V72Zm176 128v-68.37A200.25 200.25 0 0 1 128 152a200.19 200.19 0 0 1-88-20.36V200h176Z"></path>
                </g>
              </svg>
              <h5 id={item.title} className="nui-heading nui-heading-sm nui-weight-semibold nui-lead-normal mt-2">
                {item.title}
              </h5>
              <p className="nui-text nui-content-xs nui-weight-normal nui-lead-normal text-muted-400">
                {item.description}
              </p>
            </div>
          </a>
        </div>
      ))}
    </div>
  );
}

export default ToolBox;
