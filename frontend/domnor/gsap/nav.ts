import { gsap, useGSAP } from "@/utils/gsap";

export const useNavAnimation = () => {
  useGSAP(() => {
    gsap.to("#nav", {
      scrollTrigger: {
        trigger: document.body,
        start: "100 top",
        end: "150 top",
        scrub: true,
        markers: true,
      },
      opacity: 0,
      ease: "none",
    });
  });
};
