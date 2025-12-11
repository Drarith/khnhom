import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export const useNavAnimation = (isOpen: boolean) => {
  const navRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!navRef.current) return;

    const links = navRef.current.querySelectorAll(".nav-link");
    const tl = gsap.timeline();

    gsap.set(".nav-link", {
      y: 75,
    });

    if (isOpen) {
      tl.to(navRef.current, {
        y: 0,
        duration: 0.8,
        ease: "power4.inOut",
      }).to(links, {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
        duration: 0.6,
        stagger: 0.1,
        ease: "power4.inOut",
        delay: 0.2,
      });
    } else {
      tl.to(links, {
        clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
        duration: 0.4,
        stagger: 0.08,
        ease: "power4.inOut",
      }).to(navRef.current, {
        y: "-100%",
        duration: 0.8,
        ease: "power4.inOut",
        delay: 0.2,
      });
    }
  }, [isOpen]);

  return navRef;
};
