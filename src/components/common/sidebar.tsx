"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  FaBookOpen,
  FaChevronLeft,
  FaChevronRight,
  FaCircle,
  FaGraduationCap,
  FaHouse,
  FaKeyboard,
  FaListCheck,
} from "react-icons/fa6";

import { SidebarLink } from "@/components/common/sidebar-link";
import {
  SidebarLinkSelect,
  type SidebarLinkSelectProps,
} from "@/components/common/sidebar-link-select";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { useDetailCourse, useTopics } from "@/lib/spot/api";
import { cn } from "@/lib/utils";

type SidebarLink = {
  href: string;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  isActive?: boolean;
  type?: "default" | "course" | "topic" | undefined;
};

const defaultSidebarLinks: SidebarLink[] = [
  {
    href: "/dashboard",
    icon: <FaHouse aria-label="Home" className="h-5 w-5" />,
    label: "Home",
  },
  {
    href: "/dashboard/tasks",
    disabled: true,
    icon: <FaListCheck aria-label="Tasks" className="h-5 w-5" />,
    label: "Tasks",
  },
  {
    href: "/dashboard/courses",
    icon: <FaGraduationCap aria-label="Courses" className="h-5 w-5" />,
    label: "Courses",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const currentCourseId = pathname.split("/courses/")[1]?.split("/")[0];
  const currentTopicId = pathname.split("/topics/")[1]?.split("/")[0];
  const { data: course } = useDetailCourse(currentCourseId!, !!currentCourseId);
  const { data: topics } = useTopics(
    currentCourseId!,
    course?.topics
      ?.filter((topic) => topic.isAccessable)
      .map((topic) => topic.id ?? "") ?? [],
    !!currentCourseId && !!course,
  );
  const [isCollapsed, setIsCollapsed] = useLocalStorage(
    "sidebar-collapsed",
    true,
  );
  const [sidebarLinks, setSidebarLinks] = useState<SidebarLinkSelectProps[]>(
    [],
  );

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  useEffect(() => {
    if (topics) {
      const topicLinks = topics
        .map(
          (topic, index) =>
            ({
              href: `/dashboard/courses/${currentCourseId}/topics/${topic?.id}?t=${index + 1}`,
              icon: <FaCircle aria-label="Topic" className="h-2.5 w-2.5" />,
              label: `Topic ${index + 1}`,
              disabled: currentTopicId === topic?.id,
              type: "topic",
            }) as SidebarLinkSelectProps,
        )
        .reverse();

      const currentCourseLink: SidebarLinkSelectProps = {
        href: `/dashboard/courses/${currentCourseId}`,
        icon: <FaBookOpen aria-label="Course" className="h-5 w-5" />,
        label: course?.name ?? "",
        linkChildren: topicLinks,
        type: "course",
      };

      setSidebarLinks([currentCourseLink]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topics]);

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

            {defaultSidebarLinks.map((link) => (
              <SidebarLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                disabled={link.disabled}
                isCollapsed={!!isCollapsed}
              />
            ))}

            {currentCourseId &&
              sidebarLinks.map((link) => (
                <SidebarLinkSelect
                  key={link.href}
                  href={link.href}
                  icon={link.icon}
                  label={link.label}
                  disabled={link.disabled}
                  linkChildren={link.linkChildren}
                  isCollapsed={!!isCollapsed}
                  type={link.type}
                />
              ))}
          </motion.div>
        </TooltipProvider>
      </aside>
    </>
  );
}
