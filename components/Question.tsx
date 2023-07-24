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
          </details>
        </>
      )}
    </section>
  );
}

export function QuestionList({ data }: { data: Question[] }) {
  return (
    <>
      {data.map((e) => (
        <QA key={e.content} data={e} />
      ))}
    </>
  );
}
