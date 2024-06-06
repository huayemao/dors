"use client";

import {
  Dispatch,
  FC,
  PropsWithChildren,
  Reducer,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

import { Question } from "@/lib/types/Question";
import localforage from "localforage";
import { DEFAULT_COLLECTION, DEFAULT_QUESTION } from "./constants";

type State = {
  modalOpen: boolean;
  questionModalMode: "view" | "edit";
  currentCollection: typeof DEFAULT_COLLECTION;
  currentQuestion: typeof DEFAULT_QUESTION;
  collectionList: (typeof DEFAULT_COLLECTION)[];
  questionList: (typeof DEFAULT_QUESTION)[];
};

const initialState: State = {
  modalOpen: false,
  questionModalMode: "view",
  currentCollection: DEFAULT_COLLECTION,
  currentQuestion: DEFAULT_QUESTION,
  collectionList: [],
  questionList: [],
};

type Action =
  | { type: "SET_QUESTION_MODAL_MODE"; payload: State["questionModalMode"] }
  | { type: "SET_CURRENT_COLLECTION"; payload: State["currentCollection"] }
  | { type: "SET_CURRENT_QUESTION"; payload: State["currentQuestion"] }
  | { type: "SET_QUESTION_LIST"; payload: State["questionList"] }
  | { type: "SET_COLLECTION_LIST"; payload: State["collectionList"] }
  | { type: "REMOVE_QUESTION"; payload: Question["id"] }
  | { type: "SET_MODAL_OPEN"; payload: boolean }
  | { type: "CANCEL" };

export const QAsContext = createContext(initialState);
export const QAsDispatchContext = createContext<Dispatch<Action>>(() => {});

const reducer: Reducer<State, Action> = (state = initialState, action) => {
  switch (action.type) {
    case "SET_MODAL_OPEN": {
      return Object.assign({}, state, {
        modalOpen: action.payload,
      });
    }
    case "SET_QUESTION_MODAL_MODE":
      return Object.assign({}, state, {
        questionModalMode: action.payload,
      });
    case "SET_CURRENT_COLLECTION":
      return Object.assign({}, state, {
        currentCollection: action.payload,
      });
    case "SET_CURRENT_QUESTION":
      return Object.assign({}, state, {
        currentQuestion: action.payload,
      });
    case "SET_QUESTION_LIST":
      return Object.assign({}, state, {
        questionList: action.payload,
      });

    // todo: reducer 里面实际还涉及到 storage 操作，怎么办？
    case "SET_COLLECTION_LIST":
      return Object.assign({}, state, {
        collectionList: action.payload,
      });
    case "CANCEL":
      const maxSeq = state.questionList?.length
        ? Math.max(...state.questionList?.map((e) => Number(e.seq)))
        : -1;
      return Object.assign({}, state, {
        modalOpen: false,
        currentQuestion: { ...DEFAULT_QUESTION, seq: maxSeq + 1 },
        questionModalMode: "view",
      });
    case "REMOVE_QUESTION": {
      const removeItem = (id: number) => {
        const targetItemIndex = state.questionList?.findIndex(
          (e) => e.id === id
        );
        const hasTarget = targetItemIndex != undefined && targetItemIndex != -1;
        if (hasTarget) {
          return Object.assign({}, state, {
            questionList: state.questionList?.filter(
              (_, i) => i != targetItemIndex
            ),
          });
        }
      };
      removeItem(action.payload);
    }
    default:
      return state;
  }
};

export const QAsContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    localforage.getItem("collectionList").then((res) => {
      if (!res) {
        dispatch({
          type: "SET_COLLECTION_LIST",
          payload: [DEFAULT_COLLECTION],
        });
      } else {
        dispatch({
          type: "SET_COLLECTION_LIST",
          payload: res as State["collectionList"],
        });
      }
      setPending(false);
    });
  }, []);

  useEffect(() => {
    localforage.setItem("collectionList", state.collectionList);
  }, [state.collectionList]);

  useEffect(() => {
    setPending(true);

    localforage.getItem(state.currentCollection.id + "").then((res) => {
      if (!res) {
      } else {
        dispatch({
          type: "SET_QUESTION_LIST",
          payload: res as State["questionList"],
        });
      }
      setPending(false);
    });
  }, [state.currentCollection.id]);

  // 如果 collection 变了，不去同步，questionList 会变

  useEffect(() => {
    if (!pending) {
      localforage.setItem(state.currentCollection.id + "", state.questionList);
    }
  }, [state.questionList, pending]);

  return (
    <QAsContext.Provider value={state}>
      <QAsDispatchContext.Provider value={dispatch}>
        {children}
      </QAsDispatchContext.Provider>
    </QAsContext.Provider>
  );
};

export function useQAs() {
  return useContext(QAsContext);
}

export function useQAsDispatch() {
  return useContext(QAsDispatchContext);
}
