export const SITE_META = {
  name: "Dors.",
  description: "花野猫的数字花园",
  introduction: "不止于博客",
  keywords: ["数字花园", "博客", "花野猫", "个人网站", "个人博客"],
  url: "https://huayemao.run",
  author: {
    url: "https://huayemao.run",
    name: "花野猫",
  },
};

export const POSTS_COUNT_PER_PAGE = 9;

export interface SlideItem {
  image: string;
  caption: string;
}

export const slides: SlideItem[] = [
  {
    image:
      "https://www.peugeot.com.cn/Cg/Upload/www.peugeot.com.cn/image/230529/2023052917174454808.png",
    caption: "Slide 1",
  },
  {
    image:
      "https://www.peugeot.com.cn/Cg/Upload/www.peugeot.com.cn/image/230131/2023013111031915986.jpg",
    caption: "Slide 2",
  },
  {
    image:
      "https://www.peugeot.com.cn/Cg/Upload/www.peugeot.com.cn/image/230428/2023042822591769064.jpg",
    caption: "Slide 3",
  },
];
