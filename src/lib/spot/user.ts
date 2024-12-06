import { env } from "@/env";
import { domParser } from "@/lib/spot/dom-parser";

export type User = {
  name: string;
  nim: string;
};

const BASE_URL = env.NEXT_PUBLIC_BASE_URL + "/api/proxy";

export async function getUser(): Promise<User> {
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
    console.error("SPOT session expired, please login again:\n", error);
    throw new Error("SPOT session expired, please login again");
  }
}
