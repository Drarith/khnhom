import { useGSAP, ScrollTrigger } from "@/utils/gsap";
import gsap from "gsap";
import React, { useRef } from "react";

export const ThemeButton = () => {
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.set(".theme-btn", { y: 20 });

    ScrollTrigger.batch(".theme-btn", {
      start: "top 90%",
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power4.out",
        }),
    });
  }, { scope: buttonContainerRef });
  return buttonContainerRef;
};
