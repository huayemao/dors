"use client";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function useCloseModal() {
  const navigate = useNavigate();
  return useCallback(
    function () {
      if (history.length) {
        navigate(-1);
      } else {
        navigate("..", { replace: true });
      }
    },
    [navigate]
  );
}
