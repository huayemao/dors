"use client";
import React, { useEffect, useLayoutEffect } from "react";
import MagicGrid from "magic-grid";

function useMagicGrid(selector: string = ".navigation-content") {
  useLayoutEffect(() => {
    let magicGrid = new MagicGrid({
      static: true,
      maxColumns: 3,
      gutter: 25,
      // useTransform: false,
      // useMin: true,
      container: selector, // Required. Can be a class, id, or an HTMLElement.
    });
    magicGrid.listen();
  }, []);
}

export default useMagicGrid;
