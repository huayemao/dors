import Prose from "@/components/Base/Prose";
import { type Question } from "@/lib/types/Question";
import { cn } from "@/lib/utils";

export default function QA({
  data,
  preview = false,
}: {
  data: Question;
  preview?: boolean;
}) {
  const options = data.options.map((e) => e.value);
  const optionCharLength = options.join("").length;
  const optionsHorizontal = optionCharLength < 24;
  const optionsMobileHorizontal = optionCharLength < 16;
  return (
    <section className="mb-4 prose">
      <Prose content={data.seq + ". " + data.content}></Prose>
      {!preview && (
        <>
          <ul
            className={cn({
              "md:flex md:gap-6": optionsHorizontal,
              "flex gap-3": optionsMobileHorizontal,
            })}
          >
            {data.options.map((e) => (
              <li style={{ listStyle: "none" }} key={e.label}>
                {e.label}. {e.value}
              </li>
            ))}
          </ul>
          <details>
            <summary>答案</summary>
            {data.answer}
            {data.solution && (
              <blockquote dangerouslySetInnerHTML={{ __html: data.solution }} />
            )}
          </details>
        </>
      )}
    </section>
  );
}

export function QuestionList({ data }: { data: Question[] }) {
  return (
    <>
      {data.map((e, i, arr) => (
        <div key={e.content}>
          <QA data={e} />
          {i !== arr.length - 1 && <hr className="mb-4" />}
        </div>
      ))}
    </>
  );
}
