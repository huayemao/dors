type Props = {
  title: string;
  data: { key: string; value: string }[];
};

function DataList({ data, title }: Props) {
  return (
    <div className="not-prose shadow rounded nui-card-white flex flex-col py-6 mb-4">
      <div className="mb-6 flex items-center justify-between px-6">
        <h3 className="font-semibold text-lg  leading-4 text-muted-800 dark:text-white">
          <span>{title}</span>
        </h3>
      </div>
      <div className="border-muted-200 dark:border-muted-700 space-y-5 px-6 ">
        {data.map((e) => (
          <div key={e.key} className="flex items-center justify-between">
            <h5 className="font-medium leading-4 text-sm text-muted-800 dark:text-white">
              <span>{e.key}</span>
            </h5>
            <div className="flex items-center gap-1">
              <p className="text-muted-400 font-sans text-sm">{e.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DataList;
