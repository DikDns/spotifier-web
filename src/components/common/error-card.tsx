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
    >
      <Alert variant="destructive">
        <motion.div
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription className="flex flex-col gap-4">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
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
                  className="w-fit"
                >
                  {isSpotSessionExpired ? "Login" : "Try again"}
                </Button>
              </motion.div>
            )}
          </AlertDescription>
        </motion.div>
      </Alert>
    </motion.div>
  );
}
