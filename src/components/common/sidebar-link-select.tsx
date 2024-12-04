"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";

import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTriggerUnstyled,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface SidebarLinkSelectProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed?: boolean;
  linkChildren?: SidebarLinkSelectProps[];
  disabled?: boolean;
  type?: "default" | "course" | "topic";
}

export function SidebarLinkSelect({
  icon,
  label,
  isCollapsed,
  disabled,
  linkChildren,
}: SidebarLinkSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentActiveLink = linkChildren?.find((child) => {
    return child.href.split("?")[0] === pathname;
  });

  if (disabled) {
    return null;
  }

  const buttonStyles = cn(
    buttonVariants({ variant: "ghost" }),
    "flex transform bg-accent/10 text-accent cursor-pointer items-center rounded-md p-2 transition-all hover:bg-accent/10 hover:text-accent",
    !isCollapsed && "justify-start pl-4",
  );

  return (
    <Select
      defaultValue={currentActiveLink?.href}
      onValueChange={(value) => {
        router.push(value);
      }}
    >
      <Tooltip>
        {isCollapsed ? (
          <TooltipTrigger asChild>
            <SelectTriggerUnstyled className={cn(buttonStyles)}>
              {!isCollapsed && <span className="text-md ml-2">{label}</span>}
            </SelectTriggerUnstyled>
          </TooltipTrigger>
        ) : (
          <SelectTriggerUnstyled className={cn(buttonStyles)}>
            {icon}

            {!isCollapsed && (
              <motion.span
                transition={{ delay: 0.2, type: "spring" }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-md mx-2 line-clamp-1 max-w-28 text-wrap text-left"
              >
                {label}
              </motion.span>
            )}
          </SelectTriggerUnstyled>
        )}

        <SelectContent>
          {linkChildren?.map((child) => (
            <SelectItem
              key={child.href}
              className={cn("w-full cursor-pointer")}
              value={child.href}
            >
              {child.label}
            </SelectItem>
          ))}
        </SelectContent>

        <TooltipPortal>
          <TooltipContent side="right" variant="inverseAccent" sideOffset={16}>
            <p className="flex items-center gap-x-2">
              <span>{label}</span>
            </p>
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </Select>
  );
}

/* {sidebarLinks.map((link) => {
              if (link.type === "course" && topics?.length) {
                return (
                  <div key={link.href} className="flex flex-col gap-1">
                    <Select
                      defaultValue={currentTopicId}
                      onValueChange={(value) => {
                        const topic = sidebarLinks.find(
                          (l) => l.type === "topic" && l.href.includes(value),
                        );
                        if (topic) {
                          router.push(topic.href);
                        }
                      }}
                    >
                      <SelectTrigger
                        
                      >
                        {!isCollapsed ? (
                          <div className={cn(
                            "line-clamp-1 border-0 bg-accent/10 text-accent hover:bg-accent/10 hover:text-accent",
                            "focus:ring-0 focus:ring-offset-0",
                            "h-10 py-2",
                            "font-medium",
                          )}>

                          <div className="flex items-center gap-2.5">
                            {link.icon}
                            <span className="truncate text-sm font-medium">
                              {link.label}
                            </span>
                          </div>
                          </div>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                className={cn(
                                  "flex items-center justify-center rounded-md bg-accent/10 p-2 text-accent",
                                )}
                              >
                                {link.icon}
                              </button>
                            </TooltipTrigger>
                            <TooltipPortal>
                              <TooltipContent
                                variant="inverseAccent"
                                side="right"
                                sideOffset={16}
                              >
                                <span>{link.label}</span>
                              </TooltipContent>
                            </TooltipPortal>
                          </Tooltip>
                        )}
                      </SelectTrigger>
                      <SelectContent
                        className="min-w-[200px] p-1"
                        align="start"
                        sideOffset={8}
                      >
                        <SelectGroup>
                          {sidebarLinks
                            .filter((l) => l.type === "topic")
                            .map((topicLink, idx) => (
                              <SelectItem
                                key={topicLink.href}
                                value={
                                  topicLink.href
                                    .split("topics/")[1]
                                    ?.split("?")[0] ?? ""
                                }
                              >
                                <span className="flex items-center gap-2.5">
                                  {topicLink.icon}
                                  <span className="text-sm">
                                    {topicLink.label}
                                  </span>
                                </span>
                              </SelectItem>
                            ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                );
              }

              if (link.type === "topic") return null;

              return (
                <SidebarLink
                  key={link.href}
                  href={link.href}
                  icon={link.icon}
                  label={link.label}
                  shortcut={link?.shortcut}
                  isCollapsed={!!isCollapsed}
                  isActive={link.isActive}
                  disabled={link.disabled}
                />
              );
            })} */
