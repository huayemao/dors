"use client";
import localforage from "localforage";
import { useEffect, useState } from "react";

export const useStorageState = <T>(defaultKey: string, defaultValue?: T) => {
  const [key, setKey] = useState(defaultKey);
  const [data, setData] = useState(defaultValue);
  const [pending, setPending] = useState(true);

  const fetch = () => {
    localforage.getItem(key).then((res) => {
      setPending(false);
      if (!!res) {
        setData(res as T);
      } else if (!!defaultValue) {
        mutate(defaultValue);
      }
    });
  };

  useEffect(fetch, [key]);

  function mutate(v: T) {
    setData(v);
    localforage.setItem(key, v);
  }

  return { data, pending, mutate, setKey };
};
