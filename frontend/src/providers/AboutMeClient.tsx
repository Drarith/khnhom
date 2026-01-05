"use client";
import SmoothScrollProvider from "@/providers/SmoothScrollProivder";
import { AboutMeAnimation } from "@/gsap/aboutMe";
import React from "react";

export default function ClientAbout({ children }: { children: React.ReactNode }) {
  const aboutMeRef = AboutMeAnimation();
  return <div ref={aboutMeRef}><SmoothScrollProvider>{children}</SmoothScrollProvider></div>;
}