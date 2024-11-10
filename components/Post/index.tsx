import { getPost, getRecentPosts } from "@/lib/posts";
import { cn, markdownExcerpt } from "@/lib/utils";
import huayemao from "@/public/img/huayemao.svg";
import dynamic from "next/dynamic";
import { BackButton } from "../BackButton";
import { ClientOnly } from "../ClientOnly";
import PostHead from "../PostHead";
import SideTabs from "./SideTabs";
import CollectionContent from "../Collection/Content";
import { markdownToJson } from "../Collection/markdownToJson";
import { parseMDX } from "@/lib/mdx/parseMDX";
import Prose from "../Base/Prose";
import { NotesContainer } from "../Notes/NotesContainer";
import ContentModal from "./ContentModal";
import { NotesContextProvider } from "@/contexts/notes";

// todo: 这个抽成 content

const isNoteCollection = (str: any) => {
  try {
    if (typeof str != 'string') {
      return false
    }
    const obj = JSON.parse(str)
    if (obj[0].content) {
      return true
    }
    return false
  } catch (error) {
    return false
  }
}

type Props = {
  data: Awaited<ReturnType<typeof getPost>>;
  recentPosts: Awaited<ReturnType<typeof getRecentPosts>>;
};

export default async function Post({ data: post, recentPosts: posts }: Props) {
  if (!post) {
    return null;
  }

  const { content } = await parseMDX(post);

  /* @ts-ignore */
  const url = post.cover_image?.src?.large;
  /* @ts-ignore */
  const blurDataURL = post.cover_image?.dataURLs?.blur;

  const excerpt =
    post.excerpt || (await markdownExcerpt(post?.content || "")) + "...";

  const isNotes = isNoteCollection(content);
  const isCollection = post.type == "collection"
  const isFullWidth = isNotes || isCollection


  return (
    <div>
      <PostHead
        post={{ ...post, excerpt }}
        avatar={{ alt: "花野猫", src: huayemao }}
        url={url}
        blurDataURL={blurDataURL}
      />
      <section className="w-full py-12 px-4 bg-white dark:bg-muted-900">
        <div className={cn("w-full max-w-6xl mx-auto", { 'max-w-full': isFullWidth })}>
          <div className="w-full flex flex-col ltablet:flex-row lg:flex-row gap-y-8">
            <div className={cn("w-full ptablet:w-3/4 ltablet:w-2/3 lg:w-3/4 ptablet:mx-auto ptablet:print:w-full", {
              'lg:w-full ptablet:w-full': isFullWidth
            })}>
              <div className="w-full md:px-10 text-xl text-muted-800 leading-normal">
                <div className="flex justify-between w-full mb-5 print:hidden">
                  <BackButton />
                </div>
                {
                  isNotes ?
                    (
                      <div className="xl:max-w-7xl mx-auto">
                        <ClientOnly>
                          <NotesContextProvider>
                            <NotesContainer basename={post.protected ? "/protected" : "/posts"}>
                            </NotesContainer>
                          </NotesContextProvider>
                        </ClientOnly>
                      </div>
                    ) :
                    isCollection ? (
                      <ClientOnly>
                        <CollectionContent
                          items={markdownToJson(post.content!)}
                        ></CollectionContent>
                      </ClientOnly>
                    ) : (
                      <Prose content={content} />
                    )}
              </div>
            </div>
            {!isFullWidth &&
              <div className="w-full ptablet:w-3/4 ltablet:w-1/3 lg:w-1/4 ptablet:mx-auto print:hidden">
                <ClientOnly>
                  <SideTabs post={post} posts={posts}></SideTabs>
                </ClientOnly>
              </div>}
          </div>
        </div>
      </section >
      {!isCollection && !isNotes && <ContentModal></ContentModal>
      }
    </div >
  );
}
