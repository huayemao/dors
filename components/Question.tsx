import { Question } from "@/lib/types/Question";
export default function QA({ data }: { data: Question }) {
  return (
    <>
      {data.content}
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
  );
}
