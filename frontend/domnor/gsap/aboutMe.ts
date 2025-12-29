"use client";

import { useGSAP, ScrollTrigger } from "@/utils/gsap";
import gsap from "gsap";
import { useRef } from "react";

export const AboutMeAnimation = () => {
  const aboutMeRef = useRef<HTMLDivElement | null>(null);
  useGSAP(() => {
    gsap.fromTo(
      ".first-section",
      {
        opacity: 0,
        y: 10,
      },
      {
        opacity: 1,
        y: 0,
        stagger:0.1,
        delay: 1,

      }
    );
  });
  return aboutMeRef;
};
