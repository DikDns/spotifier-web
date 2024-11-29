"use client";

import { useEffect } from "react";

import { env } from "@/env";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { domParser } from "@/lib/spot/dom-parser";
import { useQuery } from "@tanstack/react-query";

type User = {
  name: string;
  nim: string;
};

const BASE_URL = env.NEXT_PUBLIC_BASE_URL + "/api/proxy";

export const useUserQuery = () => {
  const [user, setUser] = useLocalStorage<User | null>("user", null);
  const query = useQuery({
    queryKey: ["user"],
    queryFn: fetchUserInfoFromSPOT,
    initialData: user,
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data, query.isError]);

  return query;
};

async function fetchUserInfoFromSPOT() {
  try {
    const spotResponse = await fetch(BASE_URL + "/mhs");

    if (!(spotResponse instanceof Response)) {
      throw new Error("SPOT response is not a valid Response object");
    }

    const spotBody = await spotResponse.text();

    if (typeof spotBody !== "string") {
      throw new Error("SPOT response body is not a valid string");
    }

    const document = domParser(spotBody);
    const profileText = document
      .querySelector(".user-profile .profile-text")
      ?.textContent?.trim();
    const profileParts = profileText?.split(/\s+/);
    const nim = profileParts?.pop();
    const name = profileParts?.join(" ");

    if (!name || !nim) {
      throw new Error("Failed to fetch user info from SPOT");
    }

    return { name, nim };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "SPOT takes too long to respond"
    ) {
      throw error;
    }
    // Re-throw other errors
    throw new Error("Failed to fetch user info from SPOT");
  }
}
