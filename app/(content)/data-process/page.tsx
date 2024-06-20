"use client";
import { useContext, useEffect, useState } from "react";
import { DBContext } from "./DBContext";

export default function Home() {
  const {
    state: { dbWorker },
  } = useContext(DBContext);

  const [lines, setLines] = useState("");
  const [query, setQuery] = useState("");
  const [dbs, setDbs] = useState<string[]>([]);

  useEffect(() => {
    if (dbWorker && query && query !== "") {
      // console.log("Posting a message")
      
      const res = dbWorker.execSql(query);
      res.then(setLines).catch((e)=>setLines(e.message));
    }
  }, [dbWorker, query]);

  useEffect(() => {
    console.log(dbWorker)
    dbWorker?.getDbs?.()?.then(setDbs);
  }, [dbWorker]);

  return (
    <div>
      <div>{dbs}</div>
      <input
        type="file"
        id="fileInput"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const url = URL.createObjectURL(file);
            console.log(file, url, dbWorker);
            dbWorker?.readWriteDB(url, encodeURIComponent("测试数据库.db"));
          }
        }}
      />
      <p id="fileUrl"></p>
      <p>Try these two queries:</p>
      <pre>
        select * from sqlite_schema;
        <br />
        select count(*) from twl;
        <br />
        select * from twl limit 4;
        <br />
      </pre>
      <br />
      <textarea
        rows={5}
        cols={80}
        onInput={(e) => {
          // console.log((e.target).value)
          setQuery((e.target as HTMLTextAreaElement).value);
        }}
      />
      <pre>{lines}</pre>
    </div>
  );
}
