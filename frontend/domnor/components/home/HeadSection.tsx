"use client";
import { useGSAP, SplitText, gsap } from "@/utils/gsap";

export default function HeadSection() {
  useGSAP(() => {
    let tl: any;
    let inSplit: any;
    let outSplit: any;

    if (typeof document !== "undefined") {
      const init = () => {
        inSplit = SplitText.create(".in-word", { type: "chars, words" });
        outSplit = SplitText.create(".out-word", { type: "chars, words" });

        // remove initial invisibility so GSAP can reveal the chars
        document.querySelectorAll(".out-word, .in-word").forEach((el) => {
          el.classList.remove("invisible");
        });

        tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });

        // make the created char spans visible but initially transparent/off-screen
        gsap.set([...outSplit.chars, ...inSplit.chars], {
          visibility: "visible",
          x: -200,
          rotationX: -90,
          opacity: 0,
        });

        tl.to(outSplit.chars, {
          rotationX: 0,
          x: 0,
          opacity: 1,
          stagger: 0.03,
          ease: "back.out(2)",
          duration: 0.6,
        })
          .to(
            outSplit.chars,
            {
              skewX: 40,
              x: 30,
              opacity: 0,
              stagger: 0.1,
              duration: 0.3,
              delay: 5,
            },
            ">"
          )
          .to(
            inSplit.chars,
            {
              rotationX: 0,
              x: 0,
              opacity: 1,
              stagger: 0.03,
              ease: "back.out(2)",
              duration: 0.6,
            },
            ">"
          )
          .to(
            inSplit.chars,
            {
              skewX: 40,
              x: 30,
              opacity: 0,
              stagger: 0.1,
              duration: 0.3,
              delay: 5,
            },
            ">"
          );
      };

      document.fonts?.ready?.then(init).catch(init);
    }

    return () => {
      tl?.kill();
      inSplit?.revert();
      outSplit?.revert();
    };
  });
  return (
    <section
      //   ref={container}
      className="flex flex-col gap-6 items-center p-12 text-center text-white justify-center rounded-xl"
    >
      <h1 className="text-6xl font-black tracking-tighter uppercase leading-none text-start">
        ONE LINK. ALL
        <span className="relative inline-grid h-[1.1em] overflow-hidden">
          <span
            // ref={word1Ref}
            className="out-word col-start-1 row-start-1 text-blue-400 invisible ml-1"
          >
            YOU.
          </span>
          <span
            // ref={word2Ref}
            className="in-word col-start-1 row-start-1 text-green-400 invisible ml-1"
          >
            FREE.
          </span>
        </span>
      </h1>
      <h2 className="text-foreground max-w-md text-balance text-md font-medium opacity-80 text-start">
        Focus on creating, we’ll handle the rest. Share your work, curate your
        world, and accept KHQR payments, all through a single link.
      </h2>
    </section>
  );
}
