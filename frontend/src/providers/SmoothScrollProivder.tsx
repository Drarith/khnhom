"use client";

import { ReactNode, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";

type ScrollSmootherInstance = ReturnType<typeof ScrollSmoother.create>;

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const smootherRef = useRef<ScrollSmootherInstance | null>(null);

  useGSAP(
    () => {
      if (!wrapperRef.current || !contentRef.current) return;
      smootherRef.current?.kill();
      smootherRef.current = ScrollSmoother.create({
        wrapper: wrapperRef.current,
        content: contentRef.current,
        smooth: 2,
        effects: true,
      });
      return () => smootherRef.current?.kill();
    },
    { scope: wrapperRef, dependencies: [] }
  );

  return (
    <div id="smooth-wrapper" ref={wrapperRef}>
      <div id="smooth-content" ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
