"use client";
import { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import CollectionLayout, { collectionLoader } from "./Collection";
import CreateQuestionModal from "./CreateQuestionModal";
import Question, { QuestionLoader } from "./Question";
import QAsPage from "./page";

export default function Route() {
  useEffect(() => {
    // window.addEventListener("beforeunload", (e) => {
    //   e.preventDefault();
    // });

    // @ts-ignore
  }, []);

  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: (
          <div>
            <QAsPage />
          </div>
        ),
      },
      {
        path: "/:collectionId",
        element: <CollectionLayout></CollectionLayout>,
        loader: collectionLoader,
        children: [
          {
            path: "/:collectionId/:questionId",
            element: <Question></Question>,
            loader: QuestionLoader,
          },
          {
            path: "/:collectionId/create",
            element: <CreateQuestionModal></CreateQuestionModal>,
            loader: QuestionLoader,
          },
        ],
      },
    ],
    { basename: "/qa-input" }
  );
  return <RouterProvider router={router} />;
}
