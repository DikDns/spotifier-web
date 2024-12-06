"use client";

import { useEffect } from "react";

import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { getUser, type User } from "@/lib/spot/user";
import { useQuery } from "@tanstack/react-query";

export const useUser = (enabled = true) => {
  const [user, setUser] = useLocalStorage<User | undefined>("user", undefined);

  const query = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    placeholderData: user,
    staleTime: 1000 * 60 * 5,
    enabled,
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);

  return query;
};
