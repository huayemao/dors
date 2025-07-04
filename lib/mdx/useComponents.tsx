import Annotate from "@/components/Annotate";
import Carousel from "@/components/Carousel";
import { ClientOnly } from "@/components/ClientOnly";
import Columns from "@/components/Columns";
import DataList from "@/components/DataList";
import DictEntry from "@/components/DictEntry";
import { DigitsHighlightButton } from "@/components/DigitsHighlightButton";
import { Figure } from "@/components/Figure";
import Gallery from "@/components/Gallery";
import Iframe from "@/components/Iframe";
import { PersonList } from "@/components/Person";
import { Pre } from "@/components/Pre";
import { QuestionList } from "@/components/QA";
import Raw from "@/components/Raw";
import Tag from "@/components/Tag";
import ToolBox from "@/components/ToolBox";
import Word from "@/components/Word";
import { BaseCard } from "@shuriken-ui/react";
import React, { ReactElement } from "react";
import { filterEmptyLines } from "./filterEmptyLines";
import NavList from "./NavList";

// Helper to generate unique heading ids
const getHeading = (Tag: keyof JSX.IntrinsicElements) => {
  const idMap = new Map<string, number>();
  // eslint-disable-next-line react/display-name
  return function Heading(props: any) {
    let text = "";
    React.Children.forEach(props.children, (child) => {
      if (typeof child === "string") text += child;
    });
    let baseId = encodeURIComponent(text);
    let id = baseId;
    if (idMap.has(baseId)) {
      const count = idMap.get(baseId)! + 1;
      idMap.set(baseId, count);
      id = `${baseId}-${count}`;
    } else {
      idMap.set(baseId, 1);
    }
    return <Tag id={id} {...props} />;
  };
};

export const components = {
  Tag: (props) => <Tag type="primary" text={props.children}></Tag>,
  QuestionList: (props) => <QuestionList {...props} />,
  Columns: (props) => <Columns {...props} />,
  PersonList: (props) => <PersonList {...props} />,
  Word: (props) => <Word {...props} />,
  Carousel: (props) => <Carousel {...props} />,
  DigitsHighlightButton: (props) => <DigitsHighlightButton {...props} />,
  DataList: (props) => <DataList {...props} />,
  ToolBox: (props) => <ToolBox {...props} />,
  Annotate: (props) => <Annotate {...props}></Annotate>,
  Note: (props) => (
    <Annotate {...props} source={props.children}>
      {props.description}
    </Annotate>
  ),
  Raw: (props) => <Raw {...props}></Raw>,
  Gallery,
  h1: getHeading("h1"),
  h2: getHeading("h2"),
  h3: getHeading("h3"),
  h4: getHeading("h4"),
  h5: getHeading("h5"),
  pre: Pre,
  Iframe: (props) => (
    <ClientOnly>
      <Iframe {...props}></Iframe>
    </ClientOnly>
  ),
  img: Figure,
  PlayList: (props) => {
    const arr = React.Children.toArray(props.children);
    const ul = arr[0] as ReactElement;
    const lis = filterEmptyLines(React.Children.toArray(ul.props.children));
    const data = lis.map((li: ReactElement) => {
      const a = React.Children.toArray(li.props.children)[0] as ReactElement;
      const title = React.Children.toArray(a.props.children)[0] as string;
      const href = a.props.href;
      const description = a.props.title;
      return {
        title,
        href,
        description,
      };
    });

    return (
      <video id="videoPlayer" controls className="w-full">
        <source id="videoSource" src={data[0].href} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  },
  NavList: NavList,
  // p: (props) => {
  //   if (props.children) {
  //     const arr = React.Children.toArray(props.children);
  //     if (
  //       arr.every((e) => {
  //         const isEmpty = typeof e == "string" && !e.trim();
  //         const ps = (e as ReactElement).props;
  //         return isEmpty || ps?.href || ps?.src;
  //       })
  //     ) {
  //       const filtered = filterEmptyLines(arr);

  //       return (
  //         <>
  //           {React.Children.map(filtered, (child) => {
  //             return React.cloneElement(child as ReactElement);
  //           })}
  //         </>
  //       );
  //     }
  //   }
  //   return <p {...props} suppressHydrationWarning></p>;
  // },
  div: (props) => {
    const { className, children, rest } = props;
    if (!className.includes("note")) {
      return <div {...props} />;
    }

    return (
      <BaseCard color="info" className="p-6 not-prose my-2">
        {children}
      </BaseCard>
    );
    // return (
    //   <div
    //     className={cn("bg-info-100 my-2 rounded !text-info-600 p-4", className)}
    //     {...rest}
    //   >
    //     {children}
    //   </div>
    // );
  },
  DictEntry: DictEntry,
};
