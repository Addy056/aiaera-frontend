import { useEffect, useState } from "react";

export default function useTyping(active = false) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (!active) {
      setDots("");
      return;
    }

    const timer = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 350);

    return () => clearInterval(timer);
  }, [active]);

  return dots;
}