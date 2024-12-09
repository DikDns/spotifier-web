"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { FaChrome, FaDownload, FaGithub } from "react-icons/fa6";

import { MagicCard } from "@/components/common/magic-card";
import { Button } from "@/components/ui/button";

const CDN_URL =
  "https://cdn.jsdelivr.net/gh/spotifierclient/spotifier-chrome-extension@latest/dist/extension.zip";

// Hardcoded latest version for comparison
const LATEST_VERSION = "1.0";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ExtensionPage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-background to-background/80 p-6">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            backgroundImage: [
              "radial-gradient(circle at 0% 0%, violet 0%, transparent 50%)",
              "radial-gradient(circle at 100% 100%, violet 0%, transparent 50%)",
              "radial-gradient(circle at 0% 100%, violet 0%, transparent 50%)",
              "radial-gradient(circle at 100% 0%, violet 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative top-12 z-10 mx-auto max-w-4xl"
      >
        <MagicCard className="overflow-hidden">
          <motion.div
            variants={item}
            className="relative flex flex-col items-center gap-8 p-8"
          >
            {/* Header Section */}
            <div className="text-center">
              <motion.h1
                className="bg-gradient-to-r from-violet-500 to-violet-300 bg-clip-text text-4xl font-bold text-transparent"
                variants={item}
              >
                SPOTifier Extension
              </motion.h1>
              <motion.p className="mt-2 text-muted-foreground" variants={item}>
                Transform your SPOT experience
              </motion.p>
            </div>

            {/* Version Badge */}
            <motion.div variants={item} className="flex justify-center gap-4">
              <div className="flex items-center gap-3 rounded-full border border-violet-200/20 bg-violet-500/10 px-4 py-2 text-violet-500">
                <FaChrome className="h-5 w-5" />
                <span className="font-medium">
                  Latest Version {LATEST_VERSION}
                </span>
              </div>
              <div
                id="extension-version"
                className="flex items-center gap-2 text-yellow-500"
              >
                <FaChrome className="h-5 w-5" />
                <span>Extension not installed</span>
              </div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              variants={item}
              className="grid grid-cols-1 gap-4 sm:grid-cols-3"
            >
              {[
                {
                  icon: "🚀",
                  title: "Modern UI",
                  description: "Clean and intuitive interface",
                },
                {
                  icon: "🎨",
                  title: "Dark Mode",
                  description: "Easy on your eyes",
                },
                {
                  icon: "⚡",
                  title: "Fast Access",
                  description: "Quick navigation",
                },
              ].map((feature) => (
                <motion.div
                  key={feature.title}
                  whileHover={{ scale: 1.05 }}
                  className="rounded-lg border border-border/50 bg-card/50 p-4 backdrop-blur-sm"
                >
                  <div className="mb-2 text-2xl">{feature.icon}</div>
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Download Section */}
            <motion.div
              variants={item}
              className="flex flex-col items-center gap-6"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
              >
                <Button
                  asChild
                  size="lg"
                  className="relative overflow-hidden bg-violet-500 text-white hover:bg-violet-600"
                >
                  <Link href={CDN_URL}>
                    <FaDownload className="mr-2 h-4 w-4" />
                    Download Extension
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={isHovered ? { x: ["100%", "-100%"] } : {}}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </Link>
                </Button>
              </motion.div>

              <div className="flex gap-4">
                <Link
                  href="/dashboard"
                  className="text-sm text-muted-foreground transition-colors hover:text-violet-500"
                >
                  Return to Dashboard
                </Link>
                <Link
                  href="https://github.com/dikdns/spotifier-chrome-extension"
                  className="text-sm text-muted-foreground transition-colors hover:text-violet-500"
                >
                  <FaGithub className="inline h-4 w-4" /> View Source
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </MagicCard>
      </motion.div>
    </main>
  );
}
