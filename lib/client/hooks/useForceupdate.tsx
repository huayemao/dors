import { useReducer } from "react";

export const useForceUpdate = () => {
  const [, forceUpdate] = useReducer((bool) => !bool, false);
  return forceUpdate;
};
