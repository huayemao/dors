import { Question } from "@/lib/types/Question";
import { cn } from "@/lib/utils";
import { useState } from "react";
export default function QA({
  data,
  preview = false,
}: {
  data: Question;
  preview?: boolean;
}) {
  const [sources, setSources] = useState<any>({});

  const options = data.options.map((e) => e.value);
  const optionsHorizontal = options.join("").length < 24;
  return (
    <section className="mb-4">
      <p>{`${data.seq}. ${data.content}`}</p>
      {!preview && (
        <>
          <ul
            className={cn({
              "flex gap-6": optionsHorizontal,
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
