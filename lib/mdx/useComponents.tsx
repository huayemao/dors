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
import { BaseButton, BaseCard } from "@glint-ui/react";
import React, { ReactElement } from "react";
import { filterEmptyLines } from "./filterEmptyLines";
import NavList from "./NavList";
import { Activity } from "lucide-react";
import ActivityCard from "@/components/ActivityCard";

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
  Word,
  Carousel,
  DigitsHighlightButton,
  DataList,
  BaseButton: ({ className, restProps }) => (
    <BaseButton {...restProps} className={`not-prose ${className}`} />
  ),
  ToolBox,
  Annotate,
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
  div: (props) => {
    const { className, children, ...rest } = props;

    if (!props["data-remark-directive"]) {
      return <div {...props} />;
    }

    const colorMap = {
      note: "default",
      info: "info",
      warning: "warning",
      danger: "danger",
    };

    return (
      <BaseCard
        color={colorMap[props["data-remark-directive"]] || "default"}
        className="p-6 my-2"
        shadow="flat"
      >
        {children}
      </BaseCard>
    );
  },
  DictEntry: DictEntry,
  ActivityCard,
};
