"use client";

import { useTheme } from "next-themes";

import { MoonIcon, SunIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/dashboard/card";
import { useRouter } from "next/navigation";

export function Header() {
  return (
    <section className="flex gap-4 px-4">
      <Card className="basis-3/12">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Dashboard
        </h4>
      </Card>
      <Card className="basis-7/12">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          @SPOTifier
        </h4>
      </Card>

      <Card className="basis-1/12 p-0" childrenClassName="w-full">
        <ThemeToggle />
      </Card>

      <Card className="basis-1/12 p-0" childrenClassName="w-full">
        <MoreOptions />
      </Card>
    </section>
  );
}

function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-full w-full items-center justify-center rounded-none hover:bg-transparent"
        >
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MoreOptions() {
  const router = useRouter();

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
          Check Extension
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("https://spot.upi.edu/mhs")}
        >
          Back to SPOT
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
