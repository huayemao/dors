"use client";

import { getTags } from "@/lib/server/tags";
import {
  Dispatch,
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useReducer,
  useState,
} from "react";

const initialState = {
  list: [] as any[],
};

export const HerbalContext = createContext(initialState);

export const HerbalContextProvider: FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const [state, dispatch] = useReducer((_state, { payload }) => {
    return Object.assign({ ..._state }, payload);
  }, initialState);
  return (
    <HerbalContext.Provider value={state}>
      <HerbalDispatchContext.Provider value={dispatch}>
        {children}
      </HerbalDispatchContext.Provider>
    </HerbalContext.Provider>
  );
};

const HerbalDispatchContext = createContext<Dispatch<{ payload: any }>>(
  () => {}
);

export function useHerbalDispatch() {
  return useContext(HerbalDispatchContext);
}

export function useHerbalContext() {
  return useContext(HerbalContext);
}
