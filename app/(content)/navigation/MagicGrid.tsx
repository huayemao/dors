"use client";
import React, { useEffect, useLayoutEffect } from "react";
import MagicGrid from "magic-grid";

export default function M() {
  useLayoutEffect(() => {
    let magicGrid = new MagicGrid({
      static: true,
      maxColumns: 3,
      gutter: 25,
      // useMin: true,
      container: ".navigation-content", // Required. Can be a class, id, or an HTMLElement.
    });
    magicGrid.listen();
  }, []);

  return <div>MagicGrid</div>;
}
