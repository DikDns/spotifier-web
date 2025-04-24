"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  FaArrowRotateRight,
  FaChrome,
  FaDownload,
  FaFirefox,
  FaGithub,
} from "react-icons/fa6";

import { MagicCard } from "@/components/common/magic-card";
import { Button } from "@/components/ui/button";

const CDN_CHROME_URL =
  "https://github.com/DikDns/spotifier-chrome-extension/releases/latest";
const CDN_FIREFOX_URL =
  "https://github.com/DikDns/spotifier-firefox-extension/releases/latest";
const CHROME_LATEST_VERSION = "0.1";
const FIREFOX_LATEST_VERSION = "0.3";

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

export function useBrowserDetection() {
  const [browserType, setBrowserType] = useState("");
  const [isChrome, setIsChrome] = useState(false);
  const [isFirefox, setIsFirefox] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isChrome = /chrome|chromium|crios/i.test(userAgent);
    const isFirefox = /firefox|fxios/i.test(userAgent);

    if (isChrome) {
      setBrowserType("chrome");
      setIsChrome(true);
    } else if (isFirefox) {
      setBrowserType("firefox");
      setIsFirefox(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isChrome, isFirefox, browserType };
}

export function ExtensionPageComponent() {
  const [isHovered, setIsHovered] = useState(false);
  const { isChrome, isFirefox, browserType } = useBrowserDetection();

  const refreshPage = () => {
    window.location.reload();
  };

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
                Takes SPOT to the modern era.
              </motion.p>
            </div>

            {/* Version Badge */}
            <motion.div variants={item} className="flex justify-center gap-4">
              <div className="flex items-center gap-3 rounded-full border border-violet-200/20 bg-violet-500/10 px-4 py-2 text-violet-500">
                {isChrome && <FaChrome className="h-5 w-5" />}
                {isFirefox && <FaFirefox className="h-5 w-5" />}
                <span className="font-medium">
                  Latest Version{" "}
                  {isChrome ? CHROME_LATEST_VERSION : FIREFOX_LATEST_VERSION}
                </span>
              </div>
              <div
                id="extension-version"
                className="flex items-center gap-2 text-yellow-500"
              >
                <Button onClick={refreshPage} variant="ghost" size={"icon"}>
                  <FaArrowRotateRight className="h-4 w-4" />
                </Button>
                {isChrome && <FaChrome className="h-5 w-5" />}
                {isFirefox && <FaFirefox className="h-5 w-5" />}
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
                  disabled={!isChrome}
                >
                  <Link
                    href={isChrome ? CDN_CHROME_URL : CDN_FIREFOX_URL}
                    target="_blank"
                    className="capitalize"
                  >
                    <FaDownload className="mr-2 h-4 w-4" />
                    Download {browserType} Extension
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
                  href="/start"
                  className="text-sm text-muted-foreground transition-colors hover:text-violet-500"
                >
                  Return to Start
                </Link>
                <Link
                  href={`https://github.com/dikdns/spotifier-${browserType}-extension`}
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
