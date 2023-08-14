import "../styles/oaled.css";

type Props = {
  html: string;
};

function Word({ html }: Props) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}

export default Word;
