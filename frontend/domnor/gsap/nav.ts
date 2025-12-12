import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export const useNavAnimation = (isMenuOpen: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline>(null);

  useGSAP(
    () => {
      gsap.set(".nav-link", { y: "100%" });
      tl.current = gsap.timeline({ paused: true });
      tl.current
        .to(containerRef.current, {
          duration: 1.25,
          ease: "power4.inOut",
          translateY: "0%",
        })
        .to(".nav-link", {
          duration: 1,
          ease: "power4.inOut",
          y: "0%",
          stagger: 0.1,
          delay: -0.75,
        });
    },
    { scope: containerRef }
  );

  useEffect(() => {
    if (tl.current) {
      if (isMenuOpen) {
        tl.current.play();
      } else {
        tl.current.reverse();
      }
    }
  }, [isMenuOpen]);

  return containerRef;
};
