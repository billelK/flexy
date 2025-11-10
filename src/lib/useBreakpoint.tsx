import { useEffect, useState } from "react";

export function useBreakpoint() {
  const [bp, setBp] = useState<"sm"|"md"|"lg"|"xl"|"2xl">("md");
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1536) setBp("2xl");
      else if (w >= 1280) setBp("xl");
      else return setBp("sm")
      
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return bp;
}
