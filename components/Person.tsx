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
    tag: "教育学的独立形态阶段",
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
    tag: "教育学的独立形态阶段",
    title: "捷克著名教育家",
    description: "（J．J．Rousseau，1712—1778）",
    products: "《爱弥儿》",
    detail:
      "自然主义教育思想：按个体生长的自然年龄阶段，依次阐明了对处于不同年龄阶段个体教育的目标、重点、内容、方法等。开拓了以研究儿童生长与教育的关系的教育研究新领域，提升了儿童在教育过程中的地位。",
  },
  {
    name: "康德",
    avatarSrc:
      "https://tse3-mm.cn.bing.net/th/id/OIP-C.RUJbrnY2XucyXrnn7xFjPAHaKe?pid=ImgDet&rs=1",
    tag: "教育学的独立形态阶段",
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
    tag: "教育学的独立形态阶段",
    title: "-",
    description: "（J．F．Herbart，1776—1841）",
    products: "《普通教育学》",
    detail:
      "赫尔巴特接替了康德在哥尼斯堡大学的教育学教席，并于1806 年出版了《普通教育学》，标志着教育学已经成为一门独立的学科。",
  },
  {
    name: "斯宾塞",
    avatarSrc:
      "https://tse1-mm.cn.bing.net/th/id/OIP-C.gWUWAWElv8e9ogTqezmWKwHaKR?pid=ImgDet&rs=1",
    tag: "教育学发展的多样化阶段",
    title: "英国资产阶级思想家、社会学家",
    description: "（H. Spencer，1820—1903）",
    products: "《教育论》",
    detail:
      "斯宾塞是实证主义者，主张科学是对经验事实的描写和记录。他提出的教育任务是为完满生活做准备。他把人类生活分为：“1. 直接有助于自我保全的活动； 2.从获得生活必需品而间接有助于自我保全的活动； 3.目的在抚养和教育子女的活动；4. 与维持正常的社会和政治关系有关的活动；5. 生活中的闲暇时间用于满足爱好和感情的各种活动。”由此，他强调生理学、卫生学、数学、机械学、物理学、化学、地质学、生物学等实用学科的重要，反对古典语言和文学的教育。他还特别重视体育。在教学方法方面，主张启发学生学习的自觉性，反对形式教育，重视实科教育，反映了 19 世纪大工业生产对教育的要求，有功利主义色彩",
  },
  {
    name: "梅伊曼",
    avatarSrc:
      "https://tse2-mm.cn.bing.net/th/id/OIP-C.IfFKpnJJzgoYoNef9aw-9QAAAA?pid=ImgDet&rs=1",
    tag: "教育学发展的多样化阶段",
    title: "德国教育家",
    description: "（E. Meumann， 1862—1915）",
    products: "-",
    detail:
      "提出了“实验教育学”。认为过去的教育学往往与实际相抵触，必须采用实验的方法研究儿童的生活和学习。梅伊曼和拉伊的不足：他们把实验方法夸大为教育研究唯一有效的方法时，就使教育学陷入了“唯科学主义”的迷途。",
  },
  {
    name: "拉伊",
    avatarSrc:
      "https://tse4-mm.cn.bing.net/th/id/OIP-C.HNRC8yoRgFy-azn5DJRVhQHaKO?pid=ImgDet&rs=1",
    tag: "教育学发展的多样化阶段",
    title: "德国教育家",
    description: "（W. A.Lay，1862—1926）",
    products: "《实验教育学》",
    detail:
      "教育就是对人的发展的实际指导，目的是造就完整的生物一社会（biocommunity）中完整的个性。教育的基本原则是活动和表现。每个活动单元都有三个过程：刺激—联想—反应，或印象一同化—表现，或观察—“心智的”消化（理解）—呈现。他主张一切教育教学中的被动、接受、吸收要让位于活动、表现、建构和创造。",
  },
  {
    name: "杜威",
    avatarSrc:
      "https://tse4-mm.cn.bing.net/th/id/OIP-C.9v_JC3x7zOK5tHx3Xzt3-AHaI9?pid=ImgDet&rs=1",
    tag: "教育学发展的多样化阶段",
    title: "美国教育家，创立了实用主义教育学",
    description: "（J．Dewey，1859—1952）",
    products: "《明日之学校》",
    detail:
      "教育即自然发展：人的经验的获得必须遵循连续性原则和相互作用原则。他从他的经验论出发，明确提出了“教育即生活”、“教育即生长”、“教育即经验的连续不断的改组或改造”、“从做中学”、“儿童中心”、“学校即社会”等新的教育思想，借以实现其民主理想。杜威的“儿童中心”教育就是解放儿童的教育，是传统教育思想转向现代教育思想的重要标志。此后，教育领域便出现了以赫尔巴特为代表的传统教育学派和以杜威为代表的现代教育学派的对立格局。",
  },
  {
    name: "凯洛夫",
    avatarSrc:
      "https://ts1.cn.mm.bing.net/th/id/R-C.22badabfc2e0f0803d444086b2bf85df?rik=BRR8ZqufnU0ttQ&riu=http%3a%2f%2fpic.baike.soso.com%2fugc%2fbaikepic2%2f47662%2fcut-20161114185349-1040968236.jpg%2f300&ehk=ZaGsyVks2DidsivRSJLAn3c%2f21cvpXNtR8IDj9i9OKw%3d&risl=&pid=ImgRaw&r=0",
    tag: "教育学发展的多样化阶段",
    title: "美国教育家，创立了实用主义教育学",
    description: "（M．A．Kaиpoвa，1893—1978）",
    products: "《教育学》",
    detail:
      "一本试图以马克思主义的观点和方法阐明社会主义教育规律的教育学，继承了17—19世纪欧洲的传统教育思想，重视系统知识的教育，强调课堂教学和教师的主导作用，有其积极的意义，但对弘扬学生的主体性和发展学生的智力，如何培养学生品德，则重视不够或探讨未到位。",
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

      <div className=" text-primary-500 text-center  focus-within:outline-primary-400/70 w-full">
        <span>
          <span className="text-muted-600 text-sm">著作：</span>
          <span>{products}</span>
        </span>
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
    <div className="grid lg:grid-cols-2 gap-4">
      {data.map((e, i, arr) => (
        <div key={e.name}>
          <Person {...e} />
        </div>
      ))}
    </div>
  );
}
