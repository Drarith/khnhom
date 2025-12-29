import Image from "next/image";
import { ShieldCheck, Globe, QrCode, Heart } from "lucide-react";

import ClientAbout from "@/providers/AboutMeClient";

export default function AboutPage() {
  return (
    <ClientAbout>
      <div className=" backdrop-blur-sm text-zinc-800 dark:text-zinc-100 min-h-[80vh] mt-24 max-w-6xl mx-auto px-6 py-6 md:py-12 rounded-3xl shadow-xl overflow-hidden">
        {/* Hero Section */}
        <section className=" flex flex-col lg:flex-row items-center justify-between gap-12 mb-24">
          <div className="lg:w-1/2 space-y-8">
            <div className="first-section inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
              <span>The Social Platform for Everyone</span>
            </div>

            <h1 className="first-section text-4xl md:text-6xl font-bold leading-tight">
              Share Your World, <br />
              <span className="first-section text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-500">
                One Link at a Time.
              </span>
            </h1>

            <p className="first-section text-lg opacity-80 leading-relaxed max-w-lg">
              Domnor is your digital home. A single, beautiful page to showcase
              who you are, what you create, and how to support you. Built
              specifically with the Khmer community in mind.
            </p>

            <div className="first-section flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 shadow-sm">
                <Globe className="w-5 h-5 text-accent" />
                <span className="font-semibold">Khmer Language</span>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 shadow-sm">
                <Heart className="w-5 h-5 text-pink-500" />
                <span className="font-semibold">Support Creators</span>
              </div>
            </div>
          </div>

          <div className="first-section lg:w-1/2 relative flex justify-center">
            <div className="relative w-[320px] h-[420px] md:w-[400px] md:h-[500px]">
              {/* Abstract Background Shapes */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-y-12 -translate-x-12"></div>

              {/* Main Image Container */}
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-800 rotate-2 hover:rotate-0 transition-all duration-700 ease-out">
                <Image
                  src="https://res.cloudinary.com/dosj9q3zb/image/upload/v1766906599/photo_2025-09-14_12-48-24_nigh7z.jpg"
                  alt="Our Story"
                  fill
                  className="object-cover"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                  <p className="text-white font-medium italic">
                    "Connecting Cambodia, simply."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights - User Focused */}
        <section className=" mb-24">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Why Creators Choose Domnor
            </h2>
            <p className="opacity-70">
              We've stripped away the complexity, leaving you with a platform
              that just works—beautifully and securely.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-700/50 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <Globe size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Truly Localized</h3>
              <p className="opacity-80 leading-relaxed">
                Technology shouldn't have a language barrier. Domnor is built
                from the ground up to feel native to Cambodian users, with full
                Khmer language support in every corner of the app.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-700/50 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <QrCode size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Seamless Support</h3>
              <p className="opacity-80 leading-relaxed">
                Empower your journey. Our integrated KHQR support means your
                audience can support your work instantly using their favorite
                banking apps. No complex setups, just simple support.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-700/50 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Safety First</h3>
              <p className="opacity-80 leading-relaxed">
                Share with confidence. We actively monitor and filter content to
                ensure Domnor remains a safe, positive space for you and your
                community to grow.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section - Creative Layout */}
        <section className="relative rounded-3xl overflow-hidden bg-zinc-900 text-white">
          {/* Decorative background pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <svg width="100%" height="100%">
              <pattern
                id="pattern-circles"
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="20" cy="20" r="2" fill="currentColor" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#pattern-circles)" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row">
            {/* Left Content */}
            <div className="p-10 md:p-16 md:w-2/3 space-y-6">
              <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs tracking-widest uppercase font-semibold text-accent mb-2">
                My Journey
              </div>
              <h2 className="text-3xl md:text-4xl font-serif">
                Why I Built Domnor
              </h2>

              <div className="space-y-4 text-zinc-300 leading-relaxed">
                <p>
                  I’m a self-taught developer, and Domnor started as a personal
                  portfolio project born out of a desire to solve a real
                  problem. I noticed that many people in Cambodia still share
                  their links manually or in a scattered way.
                </p>
                <p>
                  Unlike other link-sharing platforms, my approach is tailored
                  for Cambodia: safe QR payment generation, controlled content,
                  and a focus on one link to share your entire online life.
                </p>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium, totam rem aperiam, eaque
                  ipsa quae ab illo inventore veritatis et quasi architecto
                  beatae vitae dicta sunt explicabo.
                </p>
              </div>

              <div className="pt-8">
                <p className="font-handwriting text-2xl text-accent opacity-90">
                  Sarin Dararith
                </p>
                <p className="text-sm text-zinc-500 uppercase tracking-widest mt-1">
                  Founder & Developer
                </p>
              </div>
            </div>

            {/* Right Image/Visual */}
            <div className="md:w-1/3 min-h-[300px] relative bg-gradient-to-br from-zinc-800 to-zinc-900">
              <Image
                src="https://res.cloudinary.com/dosj9q3zb/image/upload/v1766906599/photo_2025-09-14_12-48-24_nigh7z.jpg"
                alt="Our Story"
                fill
                className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-zinc-900/90 md:bg-gradient-to-r"></div>
            </div>
          </div>
        </section>
      </div>
    </ClientAbout>
  );
}
