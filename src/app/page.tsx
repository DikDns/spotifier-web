"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

import SpotifierLogo from "@/assets/spotifier-logo.png";
import { HeadlineText } from "@/components/home/headline-text";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";

/**
 * Home Page
 * This is the home page of the SPOTifier website.
 * It is the first page that users see when they visit the website.
 * It is the landing page of the website.
 * It must use animation techniques to make it more engaging that designed to be for awwwards.
 * Animation techniques:
 * 1. Scroll-based animations (Storytelling with Scrollytelling)
 * 2. Viewport detection (In view animations motion)
 * 3. Sticky Positioning (Sticky Positioning)
 * 4. Easing
 * 5. Text Splitting
 *
 * SPOTifier
 * 1. Hero Section -  Tagline, Subtagline, and a button to start
 * 2. About Section - What is SPOTifier?
 * 3. Features Section - What can you do with SPOTifier?
 * 4. Testimonials Section - What people are saying about SPOTifier
 * 5. Pricing Section - How much does SPOTifier cost? (100% free open-source)
 * 6. How Does It Work Section - How does SPOTifier work? (explain cookies and how they are used)
 * 7. Contributors Section - Who is contributing to SPOTifier? github contributors
 * 8. Footer Section
 */
export default function HomePage() {
  return (
    <main className="relative h-[2000px] min-h-screen overflow-hidden">
      {/* Hero Section */}
      <motion.nav
        className="fixed left-3 top-3 rounded-full bg-card-foreground p-1"
        initial={{ opacity: 0.25 }}
        whileHover={{ opacity: 0.75 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <Link href="#">
          <Image
            alt="SPOTifier Logo"
            src={SpotifierLogo}
            width={24}
            height={24}
          />
        </Link>
      </motion.nav>

      <div className="relative h-[800px] w-full overflow-hidden bg-background blur-sm">
        <FlickeringGrid
          className="absolute inset-0 z-0 size-full"
          squareSize={8}
          gridGap={16}
          color="oklch(0.627 0.265 303.9)"
          maxOpacity={0.35}
          flickerChance={0.1}
          height={800}
          width={2000}
        />
      </div>

      <HeadlineText />

      {/* Content sections that will be revealed */}
      <div className="relative z-[1] min-h-svh w-full bg-background">
        <section className="">{/* Your About section content */}</section>

        <section className="min-h-svh">
          {/* Your Features section content */}
        </section>
      </div>
    </main>
  );
}
