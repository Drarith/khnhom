import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/src/all";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

export { gsap, useGSAP, ScrollSmoother, ScrollTrigger, SplitText };
