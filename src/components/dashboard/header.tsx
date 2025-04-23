"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import { MagicCard } from "@/components/common/magic-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale } from "@/lib/locale-utils";
import { DotsHorizontalIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";

export function Header({ title }: { title: string }) {
  return (
    <section className="flex gap-4 px-4">
      <MagicCard className="basis-3/12">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {title}
        </h4>
      </MagicCard>
      <MagicCard className="basis-7/12">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          @SPOTifier
        </h4>
      </MagicCard>

      <MagicCard className="basis-1/12 p-0" childrenClassName="w-full">
        <ThemeToggle />
      </MagicCard>

      <MagicCard className="basis-1/12 p-0" childrenClassName="w-full">
        <MoreOptions />
      </MagicCard>
    </section>
  );
}

function ThemeToggle() {
  const { setTheme } = useTheme();
  const { translations } = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-full w-full items-center justify-center rounded-none hover:bg-transparent"
        >
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">{translations.dashboard.theme.toggle}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          {translations.dashboard.theme.light}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          {translations.dashboard.theme.dark}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          {translations.dashboard.theme.system}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MoreOptions() {
  const router = useRouter();
  const { translations } = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-full w-full items-center justify-center rounded-none hover:bg-transparent"
        >
          <DotsHorizontalIcon className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push("/extension")}>
          {translations.dashboard.extension.check}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("https://spot.upi.edu/mhs")}
        >
          {translations.dashboard.extension.backToSpot}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
