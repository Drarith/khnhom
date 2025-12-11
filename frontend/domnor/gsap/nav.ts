import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useNavAnimation = () => {
  useGSAP(() => {
    const hideNavTween = gsap.to(".nav", {
      y: -100,
      opacity: 0,
      duration: 0.5,
      paused: true,
    });

    ScrollTrigger.create({
      start: "top top",
      end: 99999,
      onUpdate: (self) => {
        if (self.direction === 1 && self.scroll() > 100) {
          hideNavTween.play();
        } else {
          hideNavTween.reverse();
        }
      },
    });
  }, []);
};
