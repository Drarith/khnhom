import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";
import { Tab } from "@/components/profileEditor/ProfileEditor";

export const useTabAnimation = (
  activeTab: string,
  dependencies: unknown[] = []
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const highlighterRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const highlighter = highlighterRef.current;
      const activeElement: HTMLElement | null | undefined =
        containerRef.current?.querySelector(`[data-id="${activeTab}"]`);

      const isValidTab = Object.values(Tab).includes(activeTab as Tab);

      if (highlighter && activeElement && isValidTab) {
        const { offsetLeft, offsetTop, offsetWidth, offsetHeight } =
          activeElement;

        gsap.to(highlighter, {
          x: offsetLeft,
          y: offsetTop,
          width: offsetWidth,
          height: offsetHeight,
          duration: 0.7,
          ease: "elastic.out(1, 0.6)",
        });
      }
    },
    { dependencies: [activeTab, ...dependencies], scope: containerRef }
  );

  return { containerRef, highlighterRef };
};
