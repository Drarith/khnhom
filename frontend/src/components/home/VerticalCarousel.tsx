"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useGSAP } from "@gsap/react"; // Assuming you have the official react wrapper, if not use your utils
import gsap from "gsap";
import { useRef, useState } from "react";

const images = [
  {
    url: "https://res.cloudinary.com/dosj9q3zb/image/upload/v1767631754/vert1_qemjrs.png",
  },
  {
    url: "https://res.cloudinary.com/dosj9q3zb/image/upload/v1767631754/vert2_s6di8m.png",
  },
  {
    url: "https://res.cloudinary.com/dosj9q3zb/image/upload/v1767631754/vert3_mtjunm.png",
  },
];

export default function VerticalCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Track state so React knows when to disable buttons
  const [activeIndex, setActiveIndex] = useState(images.length - 1);

  const { contextSafe } = useGSAP({ scope: containerRef });

  // 1. INTRO ANIMATION
  useGSAP(() => {
    const tl = gsap.timeline();

    // Reset positions initially
    tl.set(cardRefs.current, { y: 1500 });
    tl.set(".chevron-up", { y: 1000 });
    tl.set(".chevron-down", { y: -1000 });

    [".chevron-up", ".chevron-down"].forEach((sel) => {
      containerRef.current
        ?.querySelectorAll(sel)
        .forEach((el) => el.classList.remove("invisible"));
    });

    cardRefs.current.forEach((sel) => {
      sel?.classList.remove("invisible");
    });

    tl.to(cardRefs.current, {
      y: 0,
      stagger: 1,
      ease: "power4.out",
      duration: 3,
      rotate: (i) => (i % 2 === 0 ? -4 : 4), // Subtle rotation
    })
      .to(".chevron-up", {
        y: 0,
        ease: "power4.out",
        duration: 0.8,
      })
      .to(".chevron-down", { y: 0, ease: "power4.out", duration: 1 }, "<");
  }, []);

  // 2. INTERACTION HANDLERS (using contextSafe for cleanup)

  // "Discard" the top card (Move Down)
  const handleNext = contextSafe(() => {
    gsap.to(`.img-container-${activeIndex}`, {
      y: "250%", // Move completely out of view
      rotation: (i) => (i % 2 === 0 ? -4 : 4),
      duration: 0.8,
      ease: "power3.in",
    });

    setActiveIndex((prev) => prev - 1);
  });

  // "Retrieve" the card (Move Up/Back)
  const handlePrev = contextSafe(() => {
    if (activeIndex >= images.length - 1) return;

    const nextIndex = activeIndex + 1;

    gsap.to(`.img-container-${nextIndex}`, {
      y: 0,
      rotation: nextIndex % 2 === 0 ? -4 : 4, // Return to original tilt
      duration: 0.8,
      ease: "power3.out",
    });

    setActiveIndex(nextIndex);
  });

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-[auto_1fr_auto] gap-2 md:gap-8 w-full max-w-4xl mx-auto h-[50vh] md:h-[60vh] items-center"
    >
      {/* Up Arrow - Brings cards back */}
      <button
        onClick={handlePrev}
        disabled={activeIndex >= images.length - 1}
        className="p-2 md:p-4 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity chevron-up invisible"
      >
        <ChevronUp className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      {/* Card Stack */}
      <div className="relative h-[400px] md:h-[500px] w-full flex items-start justify-center perspective-1000">
        {images.map((image, i) => (
          <div
            // Callback Ref: This is the React way to handle lists of refs
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            key={i}
            className={`absolute h-[400px] md:h-[500px] w-[280px] md:w-[350px] origin-bottom img-container-${i} invisible`}
            style={{ zIndex: i }} // Explicit Z-Index ensures correct stacking
          >
            <Image
              alt={`image-${i}`}
              src={image.url}
              width={400}
              height={400}
              sizes="(max-width: 640px) 200px, 400px"
              className="rounded-2xl shadow-2xl border-4 border-white object-cover"
              priority={i === images.length - 1} // Prioritize loading the top image
            />
          </div>
        ))}
      </div>

      {/* Down Arrow - Discards cards */}
      <button
        onClick={handleNext}
        disabled={activeIndex < 1}
        className="p-2 md:p-4 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity chevron-down invisible"
      >
        <ChevronDown className="w-6 h-6 md:w-8 md:h-8" />
      </button>
    </div>
  );
}
