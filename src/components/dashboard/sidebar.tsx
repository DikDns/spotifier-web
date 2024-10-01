"use client";

import { useState } from "react";
import {
  FaHouse,
  FaChevronLeft,
  FaChevronRight,
  FaListCheck,
  FaBook,
} from "react-icons/fa6";

import { motion } from "framer-motion";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { SidebarLink } from "@/components/dashboard/sidebar-link";

import { cn } from "@/lib/utils";

const sidebarLinks = [
  {
    href: "/dashboard",
    icon: <FaHouse className="h-6 w-6" />,
    label: "Home",
  },
  {
    href: "/dashboard/task",
    icon: <FaListCheck className="h-6 w-6" />,
    label: "Tasks",
  },
  {
    href: "/dashboard/courses",
    icon: <FaBook className="h-6 w-6" />,
    label: "Courses",
  },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <aside className="p-4">
      <TooltipProvider delayDuration={0}>
        <motion.div
          className="flex h-full flex-col gap-4 rounded-md bg-secondary-foreground p-2 text-secondary"
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
                {isCollapsed ? (
                  <FaChevronRight className="h-6 w-6" />
                ) : (
                  <FaChevronLeft className="h-6 w-6" />
                )}
                {!isCollapsed && (
                  <motion.span
                    transition={{ delay: 0.2, type: "spring" }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-md ml-2"
                  >
                    {"Collapse"}
                  </motion.span>
                )}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent
                variant="inverseAccent"
                side="right"
                sideOffset={16}
              >
                <p>{isCollapsed ? "Expand" : "Collapse"}</p>
              </TooltipContent>
            )}
          </Tooltip>

          <span className="border-b border-accent/25"></span>

          {sidebarLinks.map((link) => (
            <SidebarLink
              key={link.href}
              href={link.href}
              icon={link.icon}
              label={link.label}
              isCollapsed={isCollapsed}
            />
          ))}
        </motion.div>
      </TooltipProvider>
    </aside>
  );
}
