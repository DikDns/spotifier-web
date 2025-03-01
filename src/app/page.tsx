"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

import SpotifierLogo from "@/assets/spotifier-logo.png";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { TextAnimate } from "@/components/magicui/text-animate";
import { BlurFade } from "@/components/ui/blur-fade";

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
    <main className="relative min-h-screen overflow-hidden">
      {/* Hero Section */}

      <motion.nav
        className="fixed left-3 top-3 rounded-full bg-card-foreground p-1"
        initial={{ opacity: 0.25 }}
        whileHover={{ opacity: 0.75 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <Link href="#tagline">
          <Image
            alt="SPOTifier Logo"
            src={SpotifierLogo}
            width={24}
            height={24}
          />
        </Link>
      </motion.nav>

      <section
        id="tagline"
        className="flex min-h-svh flex-col items-center justify-center px-3"
      >
        <div className="mb-9">
          <TextAnimate
            animation="scaleUp"
            as="h1"
            className="text-center font-sans text-lg font-bold sm:text-4xl lg:text-6xl"
            by="character"
          >
            Takes SPOT to the modern era.
          </TextAnimate>
        </div>
        <div className="mb-6 flex w-full items-center justify-center sm:w-96">
          <BlurFade delay={0.75} blur="3px">
            <Link href="/start">
              <InteractiveHoverButton className="text-sm sm:text-lg">
                Begin the Experience
              </InteractiveHoverButton>
            </Link>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}
