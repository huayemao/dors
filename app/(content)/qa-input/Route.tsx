"use client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import CollectionLayout from "./Collection";
import CreateCollectionModal from "./CreateCollectionModal";
import CreateQuestionModal from "./CreateQuestionModal";
import Question, { QuestionLoader } from "./Question";
import QAsPage from "./page";

export default function Route() {
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <QAsPage />,
      },
      {
        path: "create",
        element: <CreateCollectionModal></CreateCollectionModal>,
      },
      {
        path: ":collectionId",
        element: <CollectionLayout></CollectionLayout>,
        children: [
          {
            path: ":questionId",
            element: <Question></Question>,
            loader: QuestionLoader,
          },
          {
            path: "create",
            element: <CreateQuestionModal></CreateQuestionModal>,
          },
          {
            path: "edit",
            element: <CreateCollectionModal></CreateCollectionModal>,
          },
        ],
      },
    ],
    { basename: "/qa-input" }
  );
  return <RouterProvider router={router} />;
}
