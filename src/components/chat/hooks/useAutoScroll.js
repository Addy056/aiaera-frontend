import { useEffect, useRef } from "react";

export default function useAutoScroll(dependencies = []) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, dependencies);

  return endRef;
}