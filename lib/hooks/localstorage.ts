"use client"
import localforage from "localforage";
import { useEffect, useState } from "react";

export const useStorageState = <T>(key: string, defaultValue?: T) => {
  const [data, setData] = useState(defaultValue);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    localforage.getItem(key).then((res) => {
      setPending(false);
      if (!!res) {
        setData(res as T);
      }
    });
  }, []);

  function mutate(v: T) {
    setData(v);
    localforage.setItem(key, v);
  }

  return { data, pending, mutate };
};
