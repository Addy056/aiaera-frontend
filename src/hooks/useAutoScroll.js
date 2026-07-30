/*
========================================
AUTO SCROLL HOOK
========================================
*/

import {
  useRef,
  useEffect,
} from "react";

/*
========================================
HOOK
========================================
*/
export default function useAutoScroll(
  dependency
) {
  const bottomRef =
    useRef(null);

  useEffect(() => {
    if (!bottomRef.current) return;

    bottomRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [dependency]);

  return bottomRef;
}