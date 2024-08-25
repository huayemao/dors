import { useDebounce } from "@uidotdev/usehooks";
import { useState, useEffect, useCallback } from "react";

function useScrolled(threshold = 60) {
  const [scrolled, setScrolled] = useState(false);

  const onScroll = useCallback(() => {
    const isScrolled = window.scrollY >= threshold;
    if (isScrolled !== scrolled) {
      setScrolled(isScrolled);
    }
  }, [scrolled, threshold]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);

  return useDebounce(scrolled, 200);
}

export default useScrolled;

// import { useDebounce, useThrottle } from "@uidotdev/usehooks";
// import { useState, useEffect, useCallback } from "react";

// function useScrolled(threshold: number = 60) {
//   const [scrolled, setScrolled] = useState(false);

//   const onScroll = useCallback(() => {
//     // 里面的 scrolled 一直都是 false
//     if (window.scrollY >= threshold && !scrolled) {
//       console.log("con 1 true, set true");
//       setScrolled(true);
//     } else {
//       console.log(scrolled);
//       if (scrolled) {
//         console.log("con 2 true, set false");
//         setScrolled(false);
//       }
//     }
//   }, [scrolled, threshold]);

//   useEffect(() => {
//     window.addEventListener("scroll", onScroll);

//     return () => {
//       window.removeEventListener("scroll", onScroll);
//     };
//   }, []);

//   return useDebounce(scrolled, 200);
// }

// export default useScrolled;
