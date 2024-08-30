"use client";
import { useNavigate } from "react-router-dom";

export function useCloseModal() {
  const navigate = useNavigate();
  return function () {
    if (history.length) {
      navigate(-1);
    } else {
      navigate("..", { replace: true });
    }
  };
}
