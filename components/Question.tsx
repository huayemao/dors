import { Question } from "@/lib/types/Question";
export default function QA({
  data,
  preview = false,
}: {
  data: Question;
  preview?: boolean;
}) {
  return (
    <section className="mb-4">
      <p>
        {data.seq}. {data.content}
      </p>
      {!preview && (
        <>
          <ul>
            {data.options.map((e) => (
              <li style={{ listStyle: "none" }} key={e.label}>
                {e.label}. {e.value}
              </li>
            ))}
          </ul>
          <details>
            <summary>答案</summary>
            {data.answer}
            {data.solution && <blockquote>{data.solution}</blockquote>}
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
