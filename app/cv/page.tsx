export default function CV() {
  return (
    <div style={{ outline: "none" }} role="group">
      <main className="antialiased text-neutral-900 bg-neutral-100 min-h-screen">
        <div className="container mx-auto shadow bg-white pt-5 px-10">
          <header
            className="
            border-b border-neutral-300
            md:flex
            items-center
            justify-between
          "
          >
            <div>
              <h1
                className="
              text-primary-500 text-4xl
              md:text-3xl
              font-bold
              tracking-wide
              leading-tight
            "
              >
                王皓
                <span className="font-light text-lg md:text-2xl text-primary-900 leading-relaxed tracking-widest">
                  中南大学
                </span>
              </h1>
            </div>
            <div className="mt-5 md:mt-0 md:border-neutral-300 md:pl-4">
              <span
                className="
              flex
              my-1
              text-primary-900
              tracking-widest
              items-center
            "
              >
                <svg className="contact-icon" viewBox="0 0 320 512">
                  <path d="M272 0H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h224c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zM160 480c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm112-108c0 6.6-5.4 12-12 12H60c-6.6 0-12-5.4-12-12V60c0-6.6 5.4-12 12-12h200c6.6 0 12 5.4 12 12v312z"></path>
                </svg>
                <a
                  className="contact-link"
                  href="file:///C:/Users/Admin/Downloads/+86%20178%207778%200719"
                  title="phone"
                >
                  +86 178 7778 0719
                </a>
              </span>
              <span className="flex text-primary-900 tracking-widest items-center">
                <svg className="contact-icon" viewBox="0 0 512 512">
                  <path d="M176 216h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16H176c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16zm-16 80c0 8.84 7.16 16 16 16h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16H176c-8.84 0-16 7.16-16 16v16zm96 121.13c-16.42 0-32.84-5.06-46.86-15.19L0 250.86V464c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V250.86L302.86 401.94c-14.02 10.12-30.44 15.19-46.86 15.19zm237.61-254.18c-8.85-6.94-17.24-13.47-29.61-22.81V96c0-26.51-21.49-48-48-48h-77.55c-3.04-2.2-5.87-4.26-9.04-6.56C312.6 29.17 279.2-.35 256 0c-23.2-.35-56.59 29.17-73.41 41.44-3.17 2.3-6 4.36-9.04 6.56H96c-26.51 0-48 21.49-48 48v44.14c-12.37 9.33-20.76 15.87-29.61 22.81A47.995 47.995 0 0 0 0 200.72v10.65l96 69.35V96h320v184.72l96-69.35v-10.65c0-14.74-6.78-28.67-18.39-37.77z"></path>
                </svg>
                <a
                  className="contact-link"
                  href="mailto:1577638495@qq.com"
                  title="email"
                >
                  1577638495@qq.com
                </a>
              </span>
            </div>
          </header>
          <section className="border-b border-neutral-300 lg:flex items-center">
            <div className="">
              <img
                className="mx-auto w-32 lg:w-full xl:w-4/5"
                src="./王皓-中南大学-软件工程_files/白底证件照.jpg"
                alt="profile"
              />
            </div>
            <div
              className="
              md:border-neutral-300 md:border-l
              text-center
              tracking-wide
              leading-relaxed
              px-4
              py-2
              lg:text-left lg:mx-8 lg:pl-8
            "
            >
              ●
              熟悉计算机专业基础知识如熟悉面向对象程序设计、设计模式、数据库模式设计及
              UML 建模
              <br />
              ● 熟悉 JavaScript（ES6、TypeScript）、DOM、BOM、HTML5/CSS3、前端
              UI 库 React、Vue 及相应上层框架如 Next.js、Nuxt.js
              <br />
              ● 良好的工程能力和解决问题的能力：Git、linux 命令&amp;脚本
              <br />
              ● 善用 AI（算法编写、代码重构、脚本编写、代码转换、技能学习）
              <br />● 较好的英文读写能力（stackoverflow、github、英文技术文档）
            </div>
          </section>
          <div className=" border-neutral-300 pb-2 mt-5 lg:flex">
            <div className="lg:w-2/3 lg:pr-8">
              <section>
                <h1 className="section-header">工作经历</h1>
                <article className="my-5">
                  <h2 className="item-header">云南小巨蛋科技有限公司</h2>
                  <h3 className="item-sub">
                    前端开发技术负责人 | 2023年2月至今
                  </h3>

                  <div className="py-4">
                    <li>
                      某教育信息化产品前端技术选型、架构设计、代码规范制定、基于
                      vue3/nuxt/ts 搭建前端开发骨架和基础设施
                    </li>
                    <li>
                      技术难点开发，如基于 canvas 封装 vue3 画板库、多端（native
                      桌面应用、web、server） 通信设计、联调等
                    </li>
                    <li>参与系统数据库表结构设计、多端通信 API 设计</li>
                    <li>制定 Git 代码库变更规范、持续集成环境搭建</li>
                  </div>
                </article>
                <article className="my-5">
                  <h2 className="item-header">
                    蚂蚁智信（杭州）信息技术有限公司
                  </h2>
                  <h3 className="item-sub">
                    语雀 yuque.com | 全栈工程师 | 2022年7月——2023年1月
                  </h3>

                  <div className="py-4">
                    <li>语雀空间线功能日常迭代</li>
                    <li>
                      负责语雀空间下线个人模块项目：数据迁移、旧功能兼容、前后端功能下线
                    </li>
                    <li>话题知识库功能改造：话题模块由个人迁移到团队</li>
                  </div>
                </article>

                <article className="my-5">
                  <h2 className="item-header">
                    百度时代网络技术（北京）有限公司
                  </h2>
                  <h3 className="item-sub">
                    工程效能部——前端开发实习生 |
                    2021年3月-2021年4月、2021年8月-2021年10月
                  </h3>
                  <li>
                    项目管理工具 icafe 的迭代日常迭代、技术改造: React Class
                    Component 迁移到 FC+ React hooks、JS 迁移到 TS
                  </li>
                  <li>负责智能监控模板功能、权限管理功能前端开发</li>
                  <p></p>
                </article>
              </section>
            </div>
            <div className="lg:w-1/3 lg:pl-8 lg:border-l lg:border-neutral-300">
              <section className="mb-5">
                <h1 className="section-header mb-5">Github</h1>
                <article className="my-5">
                  <h2 className="item-header">huayemao</h2>
                  <h3 className="item-sub">
                    <a href="https://github.com/huayemao">
                      https://github.com/huayemao
                    </a>
                  </h3>
                </article>
                <section className="mb-5">
                  <h1 className="section-header mb-5">教育经历</h1>
                  <article className="my-5">
                    <h2 className="item-header">中南大学</h2>
                    <h3 className="item-sub">软件工程专业 | 本科</h3>
                    <p className="py-4">2018年9月-2022年7月</p>
                  </article>
                </section>
              </section>

              <section className="mb-5">
                <h1 className="section-header mb-5">所获荣誉和证书</h1>
                <div className="my-2">
                  <li>软件设计师证书（中级职称）</li>
                  <li>CET6（575 分，大一下学期）</li>
                  <li>CET4（577 分，大一上学期）</li>
                  <li>2019 年全国大学生英语竞赛（NECCS）三等奖</li>
                  <li>第二届湖南省医学科技创新创业大赛三等奖</li>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
