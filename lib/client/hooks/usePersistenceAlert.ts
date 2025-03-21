import { useEffect } from "react";
import localforage from "localforage";
import toast from "react-hot-toast";

export const usePersistenceAlert = () => {
  useEffect(() => {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then((persistent) => {
        localforage.getItem("alerted").then((v) => {
          if (v) {
            return;
          }
          if (persistent) {
          } else {
            toast("注意：本地存储可能被 UA 清除");
          }
          localforage.setItem("alerted", true);
        });
      });
    }
  }, []);
};