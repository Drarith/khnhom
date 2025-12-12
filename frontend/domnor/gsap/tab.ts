import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";

export const useTabAnimation = (activeTab: string) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const highlighterRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef();

  useGSAP(
    () => {
      const highlighter = highlighterRef.current;
      const activeElement = containerRef.current?.querySelector(`[data-id="${activeTab}"]`);

      if (highlighter && activeElement) {
        const { offsetLeft, offsetTop, offsetWidth, offsetHeight } =
          activeElement;

        gsap.to(highlighter, {
          x: offsetLeft,
          y: offsetTop,
          width: offsetWidth,
          height: offsetHeight,
          duration: 0.5,
          ease: "elastic.out(1, 0.6)",
        });
      }
    },
    { dependencies: [activeTab], scope: containerRef }
  );

  return { containerRef, highlighterRef, tabsRef };
};
