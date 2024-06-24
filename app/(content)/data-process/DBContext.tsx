"use client";
import * as Comlink from "comlink";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Profession } from "./types";

export const DBContext = createContext<{
  state: {
    dbWorker: Comlink.Remote<WorkerProxy> | null;
    activeDb: string | null;
    dbs: string[];
    baseTables: any[];
  };
  actions: {
    refetch: () => void;
    setActiveDb: (db: string) => void;
  };
}>({
  state: { dbWorker: null, dbs: [], baseTables: [], activeDb: null },
  actions: {
    refetch() {
      {
      }
    },
    setActiveDb() {},
  },
});

interface WorkerProxy {
  new (): WorkerProxy;

  removeDb(path: string): Promise<void>;

  getDbs(): Promise<string[]>;

  readWriteDB(name: string, fileURL?: string): Promise<boolean>;

  execSql(sql: string): any[];

  getStatus(): string;
  
  resolveAllTables(baseTables:any[]):Promise<(Profession[] | undefined)[]> ;

}

export function DBContextProvider({ children }) {
  const getTableSql = `select * from sqlite_schema where type = 'table';`;

  const [dbWorker, setDbWorker] = useState<Comlink.Remote<WorkerProxy> | null>(
    null
  );
  const [dbs, setDbs] = useState<string[]>([]);
  const [activeDb, setActiveDb] = useState<string | null>(null);
  const [baseTables, setBaseTables] = useState<any[]>([]);

  // const [query, setQuery] = useState<any>("")
  let needsSetup = true;

  useEffect(() => {
    if (!dbWorker && needsSetup) {
      needsSetup = false;
      const _dbWorker = new Worker(new URL("dbworker.js", import.meta.url));
      const Myclass = Comlink.wrap<WorkerProxy>(_dbWorker);
      new Myclass()
        .then((instance) => {
          setDbWorker(() => instance);
          return instance;
        })
        .then((instance) => {
          instance.getDbs().then((dbs) => setDbs(dbs.map(decodeURIComponent)));
        });
    }
  }, []);

  useEffect(() => {
    if (activeDb) {
      const name = encodeURIComponent(activeDb);
      dbWorker?.readWriteDB?.(name);
      dbWorker?.execSql(getTableSql).then(setBaseTables);
    }
  }, [activeDb]);

  const refetch = useCallback(async () => {
    const dbs = await dbWorker?.getDbs();
    if (!dbs) {
      return setDbs([]);
    }
    setDbs(dbs.map(decodeURIComponent));
  }, []);

  // create the value for the context provider
  const context = {
    state: {
      dbWorker,
      dbs: dbs,
      baseTables,
      activeDb,
    },
    actions: {
      refetch,
      setActiveDb,
    },
  };

  return <DBContext.Provider value={context}>{children}</DBContext.Provider>;
}

export const useDBContext = () => {
  return useContext(DBContext);
};
