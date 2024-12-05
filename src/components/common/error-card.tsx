"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { env } from "@/env";

const SPOT_URL = env.NEXT_PUBLIC_SPOT_URL;

interface ErrorCardProps {
  title?: string;
  description?: string;
  retry?: () => void;
}

export function ErrorCard({
  title = "Something went wrong",
  description = "There was an error fetching the data. Please try again later.",
  retry,
}: ErrorCardProps) {
  const router = useRouter();
  const isSpotSessionExpired = description?.includes("SPOT session expired");

  const handleRetry = () => {
    if (isSpotSessionExpired) {
      router.push(SPOT_URL + "/mhs");
    } else if (retry) {
      retry();
    } else {
      router.refresh();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="relative overflow-hidden rounded-lg border bg-background/95 p-0.5 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-red-500/40 to-red-500/10"
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <Alert
        variant="destructive"
        className="relative border-none bg-transparent"
      >
        <motion.div
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <AlertTitle className="text-lg font-semibold tracking-tight text-destructive-foreground">
            {title}
          </AlertTitle>

          <AlertDescription className="flex flex-col gap-4">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-destructive-foreground"
            >
              {description}
            </motion.p>

            {retry && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  className="relative w-fit overflow-hidden bg-background/50 transition-colors hover:bg-accent/50"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "linear",
                    }}
                  />
                  <span className="relative">
                    {isSpotSessionExpired ? "Login" : "Try again"}
                  </span>
                </Button>
              </motion.div>
            )}
          </AlertDescription>
        </motion.div>
      </Alert>
    </motion.div>
  );
}
