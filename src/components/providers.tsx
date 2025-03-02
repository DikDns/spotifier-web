"use client";
import * as React from "react";
import { type LenisRef, ReactLenis } from "lenis/react";
import { cancelFrame, frame } from "motion/react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

import { SuspendedPostHogPageView } from "@/components/common/posthog-pageview";
import { useUser } from "@/lib/spot/api";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    capture_pageleave: true, // Enable pageleave capture
    capture_pageview: false, // Disable automatic pageview capture, as we capture manually
  });
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = React.useRef<LenisRef>(null);

  React.useEffect(() => {
    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp);
    }
    frame.update(update, true);

    return () => cancelFrame(update);
  }, []);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        duration: 1,
        prevent: (node) => {
          if (node.classList.contains("no-lenis")) {
            return true;
          } else {
            return false;
          }
        },
      }}
    >
      {children}
    </ReactLenis>
  );
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider client={posthog}>
      <PHAuthWrapper>
        <SuspendedPostHogPageView />
        {children}
      </PHAuthWrapper>
    </PostHogProvider>
  );
}

export function PHAuthWrapper({ children }: { children: React.ReactNode }) {
  const userQuery = useUser();

  React.useEffect(() => {
    if (userQuery.isSuccess && userQuery.data) {
      const user = userQuery.data;
      posthog.identify(user.nim, {
        name: user.name,
        nim: user.nim,
      });
    } else if (userQuery.isError) {
      posthog.reset();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userQuery.data]);

  return children;
}
