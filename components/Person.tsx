type Props = {
  name: string;
  avatarSrc: string;
  tag: string;
  title: string;
  description: string;
  detail: string;
  products: string;
};

const personList: Props[] = [
  {
    name: "夸美纽斯",
    avatarSrc:
      "https://ts1.cn.mm.bing.net/th/id/R-C.4ff619370cd1e2719ff0321da4bf8960?rik=j%2buKGFUHk7rifg&pid=ImgRaw&r=0&sres=1&sresct=1",
    tag: "独立形态阶段",
    title: "捷克著名教育家",
    description: "（J．A．Comenius，1592—1670）",
    products: "《大教学论》",
    detail:
      "近代最早的一部教育学著作，提出了普及初等教育的思想，论述了班级授课制度以及教学内容、教学原则与方法，高度地评价了教师的职业，强调了教师的作用。在推进新的教育理念和教育实践方面起了开创性的作用。",
  },
  {
    name: "卢梭",
    avatarSrc:
      "https://tse1-mm.cn.bing.net/th/id/OIP-C.512pb2TTy-ziZD-9Mh9ftQHaJf?pid=ImgDet&rs=1",
    tag: "独立形态阶段",
    title: "捷克著名教育家",
    description: "（J．J．Rousseau，1712—1778）",
    products: "《爱弥儿》",
    detail:
      "系统地阐述了他的自然主义教育思想，按个体生长的自然年龄阶段，依次阐明了自己对处于不同年龄阶段个体教育的目标、重点、内容、方法等一系列问题的独特见解。开拓了以研究儿童生长与教育的关系的教育研究新领域，提升了儿童在教育过程中的地位。",
  },
  {
    name: "康德",
    avatarSrc:
      "https://tse3-mm.cn.bing.net/th/id/OIP-C.RUJbrnY2XucyXrnn7xFjPAHaKe?pid=ImgDet&rs=1",
    tag: "独立形态阶段",
    title: "德国著名哲学家",
    description: "（I．Kant，1724—1804）",
    products: "-",
    detail:
      "先后四次在哥尼斯堡大学讲授教育学，是最早在大学开设教育学讲座的教授之一",
  },
  {
    name: "赫尔巴特",
    avatarSrc:
      "https://ts1.cn.mm.bing.net/th/id/R-C.2e2a4a3934b5c418b5696c2a25e92212?rik=5mXX6DkxRxJgcA&pid=ImgRaw&r=0",
    tag: "独立形态阶段",
    title: "-",
    description: "（J．F．Herbart，1776—1841）",
    products: "《普通教育学》",
    detail:
      "赫尔巴特接替了康德在哥尼斯堡大学的教育学教席，并于1806 年出版了《普通教育学》，标志着教育学已经成为一门独立的学科。",
  },
];

export default function Person({
  name,
  avatarSrc,
  tag,
  description,
  title,
  detail: intro,
  products,
}: Props) {
  return (
    <div className="dark:border-muted-700 dark:bg-muted-800 relative w-full border bg-white transition-all duration-300 !border-primary-600 relative z-20 mx-auto max-w-[340px] p-6">
      <div className="mb-6 flex items-center justify-between">
        <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs shadow-xl bg-primary-500 dark:bg-primary-500 text-white">
          {tag}
        </span>
      </div>
      <div className="relative h-full w-full  shrink-0 items-center gap-2 justify-center outline-none !flex !transition-all !duration-200">
        <div className="h-24 w-20 flex items-center justify-center overflow-hidden text-center transition-all duration-300">
          <img
            src={avatarSrc}
            className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-24 w-20"
          />
        </div>
        <div className="text-center">
          <h3 className="font-heading text-lg font-medium leading-sm !mt-2 !mb-0">
            {name}
          </h3>
          <p className="font-sans text-sm font-normal leading-normal text-muted-500 dark:text-muted-400">
            <sub className="text-xs">{description}</sub>
            <br />
            <span className="mt-2 inline-block">{title}</span>
          </p>
        </div>
      </div>

      <div>
        <button
          type="button"
          className=" text-primary-500  focus-within:outline-primary-400/70 !h-11 w-full"
        >
          <span>{products}</span>
        </button>
      </div>
      <p className="font-alt text-sm font-normal leading-normal text-muted-400 my-2 text-center">
        {intro}
      </p>
      {/* <div className="my-6 flex items-center justify-center gap-4">
        <span className="text-muted-400 hover:text-primary-500 flex items-center justify-center transition-colors duration-200">
          {description}
        </span>
      </div> */}
    </div>
  );
}

export function PersonList({ data = personList }: { data?: Props[] }) {
  return (
    <div className="grid lg:grid-cols-2 gap-x-4 gap-y-2">
      {data.map((e, i, arr) => (
        <div key={e.name}>
          <Person {...e} />
        </div>
      ))}
    </div>
  );
}
