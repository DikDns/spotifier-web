"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  FaBook,
  FaChevronLeft,
  FaChevronRight,
  FaHouse,
  FaKeyboard,
  FaListCheck,
} from "react-icons/fa6";
import { toast } from "sonner";

import { SidebarLink } from "@/components/common/sidebar-link";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  {
    href: "/dashboard",
    icon: <FaHouse aria-label="Home" className="h-6 w-6" />,
    label: "Home",
    shortcut: "Ctrl + Alt + 1",
  },
  {
    href: "/dashboard/tasks",
    disabled: true,
    icon: <FaListCheck aria-label="Tasks" className="h-6 w-6" />,
    label: "Tasks",
    shortcut: "Ctrl + Alt + 2",
  },
  {
    href: "/dashboard/courses",
    icon: <FaBook aria-label="Courses" className="h-6 w-6" />,
    label: "Courses",
    shortcut: "Ctrl + Alt + 3",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useLocalStorage(
    "sidebar-collapsed",
    true,
  );

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.altKey && event.key === "s") {
        event.preventDefault();
        toggleSidebar();
      }

      // shortcut to go to home page
      if (event.ctrlKey && event.altKey && event.key === "1") {
        event.preventDefault();
        if (pathname === "/dashboard") return;
        router.push("/dashboard");
        toast.success("Navigated to Home", {
          duration: 1000,
        });
      }

      // shortcut to go to tasks page
      if (event.ctrlKey && event.altKey && event.key === "2") {
        event.preventDefault();
        if (pathname === "/dashboard/tasks") return;
        router.push("/dashboard/tasks");
        toast.success("Navigated to Tasks", {
          duration: 1000,
        });
      }

      // shortcut to go to courses page
      if (event.ctrlKey && event.altKey && event.key === "3") {
        event.preventDefault();
        if (pathname === "/dashboard/courses") return;
        router.push("/dashboard/courses");
        toast.success("Navigated to Courses", {
          duration: 1000,
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <motion.div
        className="h-full"
        initial={{ width: 64 }}
        animate={{
          width: isCollapsed ? 64 : 260,
        }}
        transition={{ duration: 0.3 }}
      />
      <aside className="fixed bottom-6 left-6 top-6 w-64">
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
                    <FaChevronRight aria-label="Expand" className="h-6 w-6" />
                  ) : (
                    <FaChevronLeft aria-label="Collapse" className="h-6 w-6" />
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
                <TooltipPortal>
                  <TooltipContent
                    variant="inverseAccent"
                    side="right"
                    sideOffset={16}
                  >
                    <p className="flex items-center gap-x-2">
                      <span>{"Expand"}</span>
                      <FaKeyboard aria-label="Keyboard Shortcut" />
                      <span>{"(Ctrl + Alt + S)"}</span>
                    </p>
                  </TooltipContent>
                </TooltipPortal>
              )}
            </Tooltip>

            <span className="border-b border-accent/25"></span>

            {sidebarLinks.map((link) => (
              <SidebarLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                shortcut={link.shortcut}
                isCollapsed={isCollapsed ?? true}
                disabled={link.disabled}
              />
            ))}
          </motion.div>
        </TooltipProvider>
      </aside>
    </>
  );
}
