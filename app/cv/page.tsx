import parseMDX  from "@/lib/mdx/parseMDX";
import { Github, Link, Mail, Phone } from "lucide-react";

const ContactMethods = () => {
  const items = [
    "+8617877780719",
    "1577638495@qq.com",
    "https://dors.huayemao.run",
    "https://github.com/huayemao",
  ];

  function getType(e: string) {
    if (e.includes("@")) {
      return "email";
    } else if (e.includes("http")) {
      return "site";
    } else {
      return "phone";
    }
  }

  return (
    <>
      {items.map((e) => {
        const type = getType(e);

        const IconName =
          type === "email"
            ? Mail
            : type === "phone"
            ? Phone
            : e.includes("github")
            ? Github
            : Link;

        const href =
          type === "email" ? `mailto:${e}` : type === "phone" ? `tel:${e}` : e;
        return (
          <span
            key={e}
            className=" flex my-1 text-neutral-900 tracking-widest gap-2 items-center"
          >
            <IconName className="w-5 h-5" />
            <a className="contact-link" href={href} title={type}>
              {e}
            </a>
          </span>
        );
      })}
    </>
  );
};

export default async function CV() {
  return (
    <div style={{ outline: "none" }} role="group">
      <main className="antialiased text-neutral-900 bg-neutral-100 min-h-screen ">
        <div className="container pb-8 mx-auto shadow print:shadow-none bg-white pt-5 px-10 max-w-3xl space-y-2  divide-y divide-neutral-300">
          <header className="px-4  py-2  flex items-stretch justify-between gap-4">
            <div className="flex flex-col justify-between">
              <h1 className=" text-neutral-700 text-4xl md:text-3xl font-bold tracking-wide leading-tight">
                王皓{" "}
                <small className="text-neutral-500 font-light text-sm">
                  Web 应用开发工程师
                </small>
              </h1>
              <div className="">
                <ContactMethods />
              </div>
            </div>
            <div className="w-1/5 flex-shrink-0">
              <img src="/img/白底证件照.jpg" alt="profile" />
            </div>
          </header>
          <div className="md:flex pt-4 gap-6">
            <section className="w-full md:w-2/3">
              <h2 className="section-header mb-4 border-l-4 pl-2 border-neutral-500">
                工作技能
              </h2>
              <div className="prose tracking-wide leading-relaxed py-2 lg:text-left">
                {
                  (
                    await parseMDX({
                      content: `
                  + 持有系统架构设计师、软件设计师证书，熟悉计算机专业基础知识如操作系统、计算机网络、面向对象程序设计、数据库模式设计、UML 建模及设计模式
                  + 熟悉 JavaScript（ES6、TS、lodash）、HTML5/CSS3、前端 UI 库 React、Vue 及相应上层框架如 Next.js、Nuxt.js，熟练使用 JS 相关技术栈进行 Web 应用开发
                  + 较强的工程能力：熟悉 Linux 操作系统配置和管理及 Shell 脚本、熟悉 Git、善用 AI（使用 Chatgpt 进行算法编写、代码重构、脚本编写、代码转换、技能学习）
                  + 较好的英文读写能力（CET-6、流畅阅读英文技术文档及 stackoverflow、github 等技术社区英文内容）
                  `,
                    })
                  ).content
                }
              </div>
            </section>
            <section className="md:w-1/3">
              <h2 className="section-header mb-4 border-l-4 pl-2 border-neutral-500">
                专业证书
              </h2>
              <div className="prose">
                {
                  (
                    await parseMDX({
                      content: `
                  + 系统架构设计师证书<br/>（高级工程师职称）
                  + 软件设计师证书<br/>（工程师职称）
                  `,
                    })
                  ).content
                }
              </div>
              <div className="w-full">
                <img
                  className="my-auto"
                  src="/img/系统架构设计师证书.png"
                ></img>
              </div>
            </section>
          </div>
          <section className="pt-4">
            <h2 className="section-header mb-4 border-l-4 pl-2 border-neutral-500">
              教育经历
            </h2>
            <article className="my-5 flex gap-4 items-center">
              <img width={96} src="/img/csu.svg"></img>
              <div className="prose">
                <h3 className="item-header">
                  中南大学
                  <small className="pl-2 font-light">
                    软件工程专业 | 本科 | 2018年9月-2022年6月
                  </small>
                </h3>
                {
                  (
                    await parseMDX({
                      content: `
                      + 大一上下学期分别以 577、575 分的成绩通过 CET-4 和 CET-6
                      + 获校级三等奖学金、全国大学生英语竞赛（NECCS）三等奖、湖南省医学科技创新创业大赛三等奖等奖项
                      + 开发了深受中南大学师生喜爱的 [绮课](https://qike.huayemao.run) 、[阿咩课表 CSU](https://cn.bing.com/search?q=%E9%98%BF%E5%92%A9%E8%AF%BE%E8%A1%A8+CSU) 等项目
                  `,
                    })
                  ).content
                }
              </div>

              {/* todo: 校徽、绮课等 */}
            </article>
          </section>
          <section className="pt-4">
            <h2 className="section-header mb-4 border-l-4 pl-2 border-neutral-500 ">
              工作经历
            </h2>
            <div className="prose !max-w-full px-2 divide-y divide-neutral-200 space-x-3">
              <article>
                <h3>
                  云南小巨蛋科技有限公司{" "}
                  <small className="pl-2 font-light">
                    前端开发工程师 | 2023年2月 -2023年9月
                  </small>
                </h3>

                {
                  (
                    await parseMDX({
                      content: `
                      + 某教育信息化产品前端技术选型和架构设计基于 vue3、nuxt、ts 等技术栈搭建前端开发骨架和基础设施
                      + 基于 pinia 的前端状态管理设计、 基于 element-plus 组件库，使用 tailwindcss 定制组件设计系统
                      + 基于 canvas 封装画板库，支撑拖拽绘图功能
                      + 参与系统数据库表结构设计和参与系统各端（native 桌面应用、web、server）通信 API 设计、持续集成环境搭建
                  `,
                    })
                  ).content
                }
              </article>
              <article className="pt-3">
                <h3>
                  蚂蚁智信（杭州）信息技术有限公司
                  <small className="pl-2 font-light">
                    语雀 yuque.com | 全栈工程师 | 2022年7月——2023年1月
                  </small>
                </h3>

                {
                  (
                    await parseMDX({
                      content: `
                      + 语雀空间线功能日常迭代
                      + 负责语雀空间下线个人模块项目：数据迁移、旧功能兼容、前后端功能下线
                      + 话题知识库功能改造：话题模块由个人迁移到团队
                  `,
                    })
                  ).content
                }
              </article>

              <article className="pt-3">
                <h3>
                  百度时代网络技术（北京）有限公司
                  <small className="pl-2 font-light">
                    工程效能部——前端开发实习生 |
                    2021年3月-2021年4月、2021年8月-2021年10月
                  </small>
                </h3>
                {
                  (
                    await parseMDX({
                      content: `
                      + 项目管理工具 icafe 的迭代日常迭代、技术改造: React Class Component 迁移到 FC+ React hooks、JS 迁移到 TS
                      + 智能监控内网版本：
                          + 项目模板功能前端开发
                          + 权限管理功能前端开发
                  `,
                    })
                  ).content
                }
              </article>
            </div>
          </section>
          <section className="pt-4 max-h-64 grid grid-cols-3 gap-4">
            {[
              {
                src: "/img/dors_qrcode.svg",
                caption: "个人博客",
              },
              {
                src: "/img/github_qrcode.svg",
                caption: "github",
              },
              {
                src: "/img/portfolio_qrcode.svg",
                caption: "作品集",
              },
            ].map((e) => (
              <div
                className="text-center flex flex-col items-center"
                key={e.src}
              >
                <img src={e.src}></img>
                <caption className="text-neutral-600">{e.caption}</caption>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
