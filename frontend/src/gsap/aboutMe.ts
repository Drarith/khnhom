"use client";

import { useGSAP, ScrollTrigger } from "@/utils/gsap";
import gsap from "gsap";
import { useRef } from "react";

export const AboutMeAnimation = () => {
  const aboutMeRef = useRef<HTMLDivElement | null>(null);
  useGSAP(() => {
    const lines = document.querySelectorAll(".line");
    lines.forEach((line) => {
      gsap.from(line, {
        // Animation properties (The 'from' state)
        y: 100, // Start 100px down
        opacity: 0, // Start invisible
        duration: 1, // Animation duration in seconds
        ease: "power3.out",

        // ScrollTrigger configuration
        scrollTrigger: {
          trigger: line,

          // start: "top 85%" -> When the top of the element hits 85% down the viewport height
          start: "top 85%",

          // end: "bottom 15%" -> When the bottom of the element hits 15% down the viewport height
          end: "bottom 20%",

          // toggleActions: "onEnter onLeave onEnterBack onLeaveBack"
          // play: run animation forward
          // reverse: run animation backward
          toggleActions: "play reverse play reverse",
          // scrub:true,
        },
      });
    });
  });
  return aboutMeRef;
};

// export const AboutMeAnimation = () => {
//   const aboutMeRef = useRef<HTMLDivElement | null>(null);
//   useGSAP(() => {
//     gsap.fromTo(
//       ".first-section",
//       {
//         opacity: 0,
//         y: 10,
//       },
//       {
//         opacity: 1,
//         y: 0,
//         stagger:0.1,
//         delay: 1,

//       }
//     );
//   });
//   return aboutMeRef;
// };
