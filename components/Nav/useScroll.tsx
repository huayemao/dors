import { useState, useEffect, useCallback } from "react";

function useScrolled(threshold = 60) {
  const [scrolled, setScrolled] = useState(false);

  const onScroll = useCallback(() => {
    const isScrolled = window.scrollY >= threshold;
    setScrolled((prevScrolled) => {
      // 只在状态真正需要改变时才返回新值
      if (isScrolled !== prevScrolled) {
        return isScrolled;
      }
      return prevScrolled;
    });
  }, [threshold]); // 只依赖 threshold

  useEffect(() => {
    // 初始化时检查一次状态
    onScroll();
    
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);

  return scrolled;
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
