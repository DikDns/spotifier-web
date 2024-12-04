"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import type { JSX } from "react";
import { FaKeyboard } from "react-icons/fa6";

import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  href: string;
  icon: JSX.Element;
  label: string;
  isCollapsed: boolean;
  shortcut: string;
  disabled?: boolean;
}

export function SidebarLink({
  href,
  icon,
  label,
  isCollapsed,
  shortcut,
  disabled,
}: SidebarLinkProps) {
  const pathname = usePathname();

  function isActive() {
    return pathname === href;
  }

  if (disabled) {
    return null;
  }

  if (!isCollapsed) {
    return (
      <Link
        href={href}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "flex transform cursor-pointer items-center rounded-md p-2 transition-all hover:bg-accent/10 hover:text-accent",
          isCollapsed ? "justify-center" : "justify-start",
          isActive() ? "bg-accent/10 text-accent" : "text-muted-foreground",
        )}
      >
        {icon}
        {!isCollapsed && (
          <motion.span
            transition={{ delay: 0.2, type: "spring" }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-md ml-2"
          >
            {label}
          </motion.span>
        )}
      </Link>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "flex transform cursor-pointer items-center rounded-md p-2 transition-all hover:bg-accent/10 hover:text-accent",
            isCollapsed ? "justify-center" : "justify-start",
            isActive() ? "bg-accent/10 text-accent" : "text-muted-foreground",
          )}
        >
          {icon}
          {!isCollapsed && <span className="text-md ml-2">{label}</span>}
        </Link>
      </TooltipTrigger>

      <TooltipPortal>
        <TooltipContent side="right" variant="inverseAccent" sideOffset={16}>
          <p className="flex items-center gap-x-2">
            <span>{label}</span>
            <FaKeyboard aria-label="Keyboard Shortcut" />
            <span>{shortcut}</span>
          </p>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}
