"use client";
import * as Comlink from "comlink";
import { createContext, useEffect, useState } from "react";

export const DBContext = createContext<{
  state: { dbWorker: Comlink.Remote<WorkerProxy> | null };
}>({
  state: { dbWorker: null },
});

interface WorkerProxy {
  new (): WorkerProxy;

  removeDb(path: string): Promise<void>;

  getDbs(): Promise<string[]>;

  readWriteDB(name: string, fileURL?: string): Promise<boolean>;

  execSql(sql: string): any[];

  getStatus(): string;
}

export function DBContextProvider({ children }) {
  const [dbWorker, setDbWorker] = useState<Comlink.Remote<WorkerProxy> | null>(
    null
  );
  // const [query, setQuery] = useState<any>("")
  let needsSetup = true;

  useEffect(() => {
    if (!dbWorker && needsSetup) {
      needsSetup = false;
      const _dbWorker = new Worker(new URL("dbworker.js", import.meta.url));
      const Myclass = Comlink.wrap<WorkerProxy>(_dbWorker);
      new Myclass().then((_i) => {
        setDbWorker(() => _i);
      });
    }
  }, []);

  let needFileWritten = true;
  useEffect(() => {
    if (needFileWritten) {
      needFileWritten = false;
      const _fileWorker = new Worker(new URL("fileworker.js", import.meta.url));
      _fileWorker.postMessage(`this is a long text string.
      Actually not that long.
      But long enough to do a quick test.
      `);
    }
  }, []);

  // create the value for the context provider
  const context = {
    state: {
      dbWorker,
    },
    actions: {},
  };

  return <DBContext.Provider value={context}>{children}</DBContext.Provider>;
}
