import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";

export const useTabAnimation = (activeTab: string) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const highlighter = container.querySelector(".tab-highlighter");
      const activeElement = container.querySelector(
        `[data-tab-id="${activeTab}"]`
      );

      if (highlighter && activeElement) {
        const { offsetLeft, offsetTop, offsetWidth, offsetHeight } =
          activeElement as HTMLElement;

        console.log("Animating highlighter to:", {
          offsetLeft,
          offsetTop,
          offsetWidth,
          offsetHeight,
        });

        gsap.to(highlighter, {
          x: offsetLeft,
          y: offsetTop,
          width: offsetWidth,
          height: offsetHeight,
          duration: 1,
          ease: "elastic.out(1, 0.6)",
        });
      }
    },
    { dependencies: [activeTab], scope: containerRef }
  );

  return containerRef;
};
