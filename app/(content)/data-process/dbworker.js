import * as Comlink from "comlink";
import sqlite3InitModule from "./sqlite3-bundler-friendly.mjs";

let sqlite3
let status = 'sqlite3_initing'
let db

sqlite3InitModule().then(sqlite => {
  sqlite3 = sqlite
  status = 'sqlite3_inited'
})

class WorkerProxy {
  async getDbs() {
    const root = await navigator.storage.getDirectory();
    const dbs = []
    for await (let [name, handle] of root.entries()) {
      console.log(name)
      dbs.push(name)
    }
    return dbs
  };

  async readWriteDB(fileURL, name) {

    let start = Date.now();
    const root = await navigator.storage.getDirectory();
    const dbHandle = await root.getFileHandle(name, { create: true });
    // Get sync access handle
    const accessHandle = await dbHandle.createSyncAccessHandle();
    const response = await fetch(fileURL);
    const content = await response.blob();
    const bindata = await content.arrayBuffer();
    const dataview = new DataView(bindata);
    const writeBuffer = accessHandle.write(dataview);
    accessHandle.flush();
    // Always close FileSystemSyncAccessHandle if done.
    accessHandle.close();


    const timeToFetchDump = Date.now() - start;
    console.log(`Time to write db file ${timeToFetchDump}ms`)

    console.log(`DB Init start at ${start}`)
    const oo = sqlite3.oo1; /*high-level OO API*/

    if (oo) {
      start = Date.now()
      db = new oo.OpfsDb(name);
      const timeToInit = Date.now() - start;

      console.log(db)
      console.log(`Time to initialize ${timeToInit}ms`)

      status = 'db_ready'
      return true
    }

  }
  execSql(sql) {
    if (!db) {
      return
    }
    let rows = [];
    db.exec({
      sql: sql,
      rowMode: 'object',
      resultRows: rows,
    });
    const results = JSON.stringify(rows, null, 2)
    return results
  };
  getStatus() {
    return status;
  };
}

Comlink.expose(WorkerProxy)

// function copy(src)  {
//   var dst = new ArrayBuffer(src.length);
//   new Uint8Array(dst).set(new Uint8Array(src));
//   return dst;
// }


