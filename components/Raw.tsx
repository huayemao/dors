
function Raw({ data }) {
  return <div dangerouslySetInnerHTML={{ __html: data }} />;
}

export default Raw;
