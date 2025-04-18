"use client";
import { useCallback } from "react";
import { useNavigate, useLocation, useRoutes } from "react-router-dom";

export function useCloseModal() {
  const navigate = useNavigate();
  const locationR = useLocation();
  return useCallback(
    function () {
      if (
        history.length > 1 &&
        !!document.referrer &&
        document.referrer.includes(location.hostname) &&
        location.href.includes(document.referrer)
      ) {
        navigate(-1);
      } else {
        if (locationR.search) {
          navigate({ search: "" }, { replace: true });
        } else {
          navigate("../", { replace: true });
        }
      }
    },
    [navigate, locationR]
  );
}
