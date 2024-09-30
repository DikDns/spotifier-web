"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  HomeIcon,
  FileTextIcon,
  PinRightIcon,
  PinLeftIcon,
} from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className="p-4">
      <TooltipProvider delayDuration={0}>
        <motion.div
          className={`flex h-full flex-col gap-4 rounded-md bg-secondary-foreground p-2 text-secondary`}
          initial={{ width: 64 }}
          animate={{ width: isCollapsed ? 64 : 208 }}
          transition={{ duration: 0.3 }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={toggleSidebar}
                className={cn(
                  "flex transform cursor-pointer items-center rounded-md p-2 transition-all hover:bg-accent/10 hover:text-accent",
                  isCollapsed ? "justify-center" : "justify-start",
                )}
                variant="ghost"
              >
                {!isCollapsed ? (
                  <PinLeftIcon className="h-6 w-6" />
                ) : (
                  <PinRightIcon className="h-6 w-6" />
                )}
                {!isCollapsed && <span className="ml-2">Collapse</span>}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                <p>{isCollapsed ? "Expand" : "Collapse"}</p>
              </TooltipContent>
            )}
          </Tooltip>

          {isCollapsed ? ( // Show tooltips only when collapsed
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard"
                  className={cn(
                    "flex items-center justify-center p-2",
                    isCollapsed ? "justify-center" : "justify-start",
                  )}
                >
                  <HomeIcon className="h-6 w-6" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Home</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              href="/dashboard"
              className="flex items-center justify-start p-2"
            >
              <HomeIcon className="h-6 w-6" />
              <span className="ml-2">Home</span>
            </Link>
          )}

          {isCollapsed ? ( // Show tooltips only when collapsed
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard/task"
                  className={cn(
                    "flex items-center justify-center p-2",
                    isCollapsed ? "justify-center" : "justify-start",
                  )}
                >
                  <FileTextIcon className="h-6 w-6 text-muted-foreground" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Documents</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              href="/dashboard/task"
              className="flex items-center justify-start p-2"
            >
              <FileTextIcon className="h-6 w-6 text-muted-foreground" />
              <span className="ml-2">Documents</span>
            </Link>
          )}
        </motion.div>
      </TooltipProvider>
    </aside>
  );
}
