import Annotate from "@/components/Annotate";
import Carousel from "@/components/Carousel";
import { ClientOnly } from "@/components/ClientOnly";
import Columns from "@/components/Columns";
import DataList from "@/components/DataList";
import { DigitsHighlightButton } from "@/components/DigitsHighlightButton";
import { Figure } from "@/components/Figure";
import Gallery from "@/components/Gallery";
import Iframe from "@/components/Iframe";
import { PersonList } from "@/components/Person";
import { Pre } from "@/components/Pre";
import { QuestionList } from "@/components/Question";
import Raw from "@/components/Raw";
import Tag from "@/components/Tag";
import ToolBox from "@/components/ToolBox";
import Word from "@/components/Word";
import { BaseCard } from "@shuriken-ui/react";

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
    Gallery: (props) => <Gallery {...props}></Gallery>,
    h1: (props) => <h1 id={encodeURIComponent(props.children)} {...props}></h1>,
    h2: (props) => <h2 id={encodeURIComponent(props.children)} {...props}></h2>,
    h3: (props) => <h3 id={encodeURIComponent(props.children)} {...props}></h3>,
    h4: (props) => <h4 id={encodeURIComponent(props.children)} {...props}></h4>,
    h5: (props) => <h5 id={encodeURIComponent(props.children)} {...props}></h5>,
    pre: Pre,
    Iframe: (props) => <ClientOnly><Iframe {...props}></Iframe></ClientOnly>,
    img: (props) => {
        return <Figure {...props} />;
    },
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
};