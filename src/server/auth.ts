import { env } from "@/env";
import { fetchTimeout } from "@/lib/fetch-timeout";

export type Session = {
  user: {
    id: string;
    name: string | null;
    nim: string | null;
  };
  session: {
    id: string;
    laravelSession: string;
    xsrfToken: string;
    casAuth: string;
  };
  status: "success" | "error";
  message: string;
};

export async function checkCookies(
  laravelSession: string,
  xsrfToken: string,
  casAuth: string,
) {
  try {
    const headers = {
      Cookie: `laravel_session=${laravelSession};XSRF-TOKEN=${xsrfToken};CASAuth=${casAuth}`,
      Host: "spot.upi.edu",
      Connection: "keep-alive",
      Accept: "*/*",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    };
    const url = env.NEXT_PUBLIC_SPOT_URL + "/mhs";

    // Create a promise that rejects after 5 seconds

    const spotResponse = await fetchTimeout(url, {
      headers,
      method: "GET",
      redirect: "manual",
    });

    if (!(spotResponse instanceof Response)) {
      throw new Error("SPOT response is not a valid Response object");
    }

    if (spotResponse.status !== 200) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking cookies: ", error);
    return false;
  }
}
