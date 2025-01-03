"use client";
import { useCallback } from "react";
import { useNavigate, useLocation, useRoutes } from "react-router-dom";

export function useCloseModal() {
  const navigate = useNavigate();
  return useCallback(
    function () {
      if (
        history.length > 1 &&
        !!document.referrer &&
        document.referrer.includes(location.hostname)
      ) {
        navigate(-1);
      } else {
        navigate("../", { replace: true });
      }
    },
    [navigate]
  );
}
